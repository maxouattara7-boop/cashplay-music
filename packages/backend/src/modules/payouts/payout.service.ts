import { prisma } from '../../database/prisma.service';
import { appConfig } from '../../config/env';
import { UserRole, PayoutStatus } from '@prisma/client';

export interface RequestPayoutDTO {
  amountXOF: number;
  phoneNumber: string;
  paymentMethod: string; // ORANGE_MONEY, MOOV_MONEY, WAVE
}

export class PayoutService {
  async requestPayout(userId: string, role: UserRole, data: RequestPayoutDTO) {
    if (data.amountXOF < appConfig.minPayoutAmount) {
      throw new Error(`Le seuil minimal de retrait est de ${appConfig.minPayoutAmount} F CFA (hors taxes et commissions)`);
    }

    if (role === UserRole.ARTIST) {
      const artist = await prisma.artistProfile.findUnique({
        where: { userId },
      });
      if (!artist) throw new Error('Profil artiste introuvable');
      if (artist.withdrawableXOF < data.amountXOF) {
        throw new Error('Solde retirable insuffisant');
      }

      // Déduire le montant du solde disponible
      await prisma.artistProfile.update({
        where: { id: artist.id },
        data: { withdrawableXOF: { decrement: data.amountXOF } },
      });

      const payout = await prisma.payout.create({
        data: {
          amountXOF: data.amountXOF,
          artistId: artist.id,
          phoneNumber: data.phoneNumber,
          paymentMethod: data.paymentMethod,
          status: PayoutStatus.PENDING,
        },
      });

      return payout;
    } else if (role === UserRole.LABEL) {
      const label = await prisma.labelProfile.findUnique({
        where: { userId },
      });
      if (!label) throw new Error('Profil label introuvable');
      if (label.withdrawableXOF < data.amountXOF) {
        throw new Error('Solde retirable insuffisant');
      }

      await prisma.labelProfile.update({
        where: { id: label.id },
        data: { withdrawableXOF: { decrement: data.amountXOF } },
      });

      const payout = await prisma.payout.create({
        data: {
          amountXOF: data.amountXOF,
          labelId: label.id,
          phoneNumber: data.phoneNumber,
          paymentMethod: data.paymentMethod,
          status: PayoutStatus.PENDING,
        },
      });

      return payout;
    }

    throw new Error('Seuls les profils Artiste et Label peuvent effectuer des retraits');
  }

  async getMyPayouts(userId: string, role: UserRole) {
    if (role === UserRole.ARTIST) {
      const artist = await prisma.artistProfile.findUnique({ where: { userId } });
      if (!artist) return [];
      return prisma.payout.findMany({
        where: { artistId: artist.id },
        orderBy: { createdAt: 'desc' },
      });
    } else if (role === UserRole.LABEL) {
      const label = await prisma.labelProfile.findUnique({ where: { userId } });
      if (!label) return [];
      return prisma.payout.findMany({
        where: { labelId: label.id },
        orderBy: { createdAt: 'desc' },
      });
    }
    return [];
  }
}

export const payoutService = new PayoutService();
