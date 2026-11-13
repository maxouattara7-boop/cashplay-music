import { prisma } from '../../database/prisma.service';
import { appConfig } from '../../config/env';
import { PayoutStatus } from '@prisma/client';

export class AdminService {
  /**
   * Statistiques et indicateurs financiers globaux de la plateforme
   */
  async getGlobalStats() {
    const ordersAgg = await prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amountXOF: true },
    });

    const totalSalesXOF = ordersAgg._sum.amountXOF || 0;
    const platformCommissionXOF = Math.floor(
      (totalSalesXOF * appConfig.commission.platformPercent) / 100
    );
    const creatorRoyaltiesXOF = Math.floor(
      (totalSalesXOF * appConfig.commission.creatorPercent) / 100
    );

    const totalUsers = await prisma.user.count();
    const totalArtists = await prisma.artistProfile.count();
    const totalReleases = await prisma.release.count();

    return {
      totalSalesXOF,
      platformCommissionXOF, // 20% marge CashPlay
      creatorRoyaltiesXOF,    // 80% ayants droit
      totalUsers,
      totalArtists,
      totalReleases,
      currency: appConfig.currency,
    };
  }

  /**
   * Liste des sorties en attente de modération
   */
  async getPendingReleases() {
    return prisma.release.findMany({
      where: { isDistributionPaid: true },
      include: {
        artist: true,
        label: true,
        tracks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Traitement d'un retrait Mobile Money
   */
  async processPayout(payoutId: string, action: 'APPROVE' | 'REJECT', reason?: string) {
    const payout = await prisma.payout.findUnique({
      where: { id: payoutId },
    });

    if (!payout) {
      throw new Error('Demande de retrait introuvable');
    }

    if (payout.status !== PayoutStatus.PENDING) {
      throw new Error('Cette demande a déjà été traitée');
    }

    if (action === 'APPROVE') {
      const updated = await prisma.payout.update({
        where: { id: payoutId },
        data: {
          status: PayoutStatus.PAID,
          processedAt: new Date(),
        },
      });
      return updated;
    } else {
      // Si rejet, recréditer immédiatement le solde
      if (payout.artistId) {
        await prisma.artistProfile.update({
          where: { id: payout.artistId },
          data: { withdrawableXOF: { increment: payout.amountXOF } },
        });
      } else if (payout.labelId) {
        await prisma.labelProfile.update({
          where: { id: payout.labelId },
          data: { withdrawableXOF: { increment: payout.amountXOF } },
        });
      }

      const updated = await prisma.payout.update({
        where: { id: payoutId },
        data: {
          status: PayoutStatus.REJECTED,
          rejectionReason: reason || 'Retrait rejeté par la modération',
          processedAt: new Date(),
        },
      });
      return updated;
    }
  }
}

export const adminService = new AdminService();
