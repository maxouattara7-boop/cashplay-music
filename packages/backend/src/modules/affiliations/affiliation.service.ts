import { prisma } from '../../database/prisma.service';

export class AffiliationService {
  /**
   * Statistiques d'affiliation de l'auditeur
   * Règle officielle : 5 filleuls ayant acheté = 1 téléchargement gratuit
   */
  async getAffiliationStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const totalReferrals = await prisma.affiliation.count({
      where: { referrerId: userId },
    });

    const purchasingReferrals = await prisma.affiliation.count({
      where: { referrerId: userId, hasPurchased: true },
    });

    // 1 téléchargement offert tous les 5 acheteurs
    const freeDownloadsEarned = Math.floor(purchasingReferrals / 5);

    return {
      referralCode: user.referralCode,
      referralLink: `https://cashplay.africa/register?ref=${user.referralCode}`,
      totalReferrals,
      purchasingReferrals,
      freeDownloadsAvailable: freeDownloadsEarned,
      nextRewardThreshold: 5 - (purchasingReferrals % 5),
    };
  }

  /**
   * Marquer un achat effectué par un filleul
   */
  async recordReferredPurchase(referredUserId: string) {
    const affiliation = await prisma.affiliation.findUnique({
      where: { referredUserId },
    });

    if (affiliation && !affiliation.hasPurchased) {
      await prisma.affiliation.update({
        where: { id: affiliation.id },
        data: { hasPurchased: true },
      });
    }
  }
}

export const affiliationService = new AffiliationService();
