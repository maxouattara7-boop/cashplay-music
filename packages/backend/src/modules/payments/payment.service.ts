import { prisma } from '../../database/prisma.service';
import { saspayClient } from './saspay.client';
import { appConfig } from '../../config/env';
import { PaymentStatus } from '@prisma/client';

export interface InitiatePaymentDTO {
  userId: string;
  trackId?: string;
  releaseId?: string;
  isLabelSubscription?: boolean;
  paymentMethod: string; // ORANGE_MONEY, MOOV_MONEY, WAVE, CARD
  customerPhone?: string;
  customerEmail?: string;
}

export class PaymentService {
  /**
   * Initialisation d'une commande et appel vers SasPay
   */
  async initiatePayment(data: InitiatePaymentDTO) {
    let amountXOF = 0;

    if (data.trackId) {
      const track = await prisma.track.findUnique({ where: { id: data.trackId } });
      if (!track) throw new Error('Morceau introuvable');
      amountXOF = track.priceXOF;
    } else if (data.releaseId) {
      const release = await prisma.release.findUnique({ where: { id: data.releaseId } });
      if (!release) throw new Error('Sortie introuvable');
      amountXOF = release.distributionFeeXOF;
    } else if (data.isLabelSubscription) {
      amountXOF = appConfig.pricing.labelAnnualSubscription; // 15 000 FCFA
    } else {
      throw new Error('Cible de paiement non spécifiée');
    }

    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        trackId: data.trackId,
        releaseId: data.releaseId,
        amountXOF,
        paymentMethod: data.paymentMethod,
        status: PaymentStatus.PENDING,
      },
    });

    const sasResponse = await saspayClient.createPayment({
      orderId: order.id,
      amount: amountXOF,
      currency: appConfig.currency,
      paymentMethod: data.paymentMethod,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { providerRef: sasResponse.transactionId },
    });

    return {
      orderId: order.id,
      amountXOF,
      currency: appConfig.currency,
      paymentUrl: sasResponse.checkoutUrl,
    };
  }

  /**
   * Traitement du Webhook SasPay
   */
  async handleWebhook(payload: any) {
    const { orderId, status, signature } = payload;

    const isValid = saspayClient.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      throw new Error('Signature webhook invalide');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        track: true,
        release: true,
      },
    });

    if (!order) {
      throw new Error('Commande introuvable');
    }

    if (order.status === PaymentStatus.COMPLETED) {
      return { received: true, status: order.status, message: 'Déjà traité' };
    }

    if (status === 'SUCCESS' || status === 'COMPLETED') {
      // 1. Mettre à jour la commande
      await prisma.order.update({
        where: { id: order.id },
        data: { status: PaymentStatus.COMPLETED },
      });

      // 2. Si c'est un achat de morceau
      if (order.trackId && order.track) {
        // Enregistrer la possession du morceau par l'auditeur
        await prisma.purchasedTrack.create({
          data: {
            userId: order.userId,
            trackId: order.trackId,
            pricePaid: order.amountXOF,
          },
        });

        // Incrémenter le compteur de ventes
        await prisma.track.update({
          where: { id: order.trackId },
          data: { saleCount: { increment: 1 } },
        });

        // Créditer le créateur (Artiste ou Label) selon la commission officielle : 20% CashPlay / 80% Ayants droit
        if (order.track.artistId) {
          const creatorShare = Math.floor(
            (order.amountXOF * appConfig.commission.creatorPercent) / 100
          ); // 80% officiel

          await prisma.artistProfile.update({
            where: { id: order.track.artistId },
            data: { withdrawableXOF: { increment: creatorShare } },
          });
        }
      }

      // 3. Si c'est le paiement de frais de distribution d'un projet
      if (order.releaseId) {
        await prisma.release.update({
          where: { id: order.releaseId },
          data: { isDistributionPaid: true },
        });
      }

      return { received: true, status: PaymentStatus.COMPLETED };
    }

    // En cas d'échec
    await prisma.order.update({
      where: { id: order.id },
      data: { status: PaymentStatus.FAILED },
    });

    return { received: true, status: PaymentStatus.FAILED };
  }
}

export const paymentService = new PaymentService();
