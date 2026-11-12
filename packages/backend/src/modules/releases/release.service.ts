import { prisma } from '../../database/prisma.service';
import { appConfig } from '../../config/env';
import { ReleaseType, UserRole } from '@prisma/client';

export interface CreateReleaseDTO {
  title: string;
  type: ReleaseType;
  genre: string;
  coverUrl: string;
  description?: string;
  isGlobalDistribution?: boolean;
}

export class ReleaseService {
  /**
   * Calcul du tarif de distribution officiel
   * Single : 2 000 FCFA | EP : 5 000 FCFA | Album : 7 000 FCFA
   * Option distribution globale (+150 plateformes) : +30%
   */
  calculateDistributionFee(type: ReleaseType, isGlobal: boolean): number {
    let baseFee = appConfig.pricing.single;
    if (type === ReleaseType.EP) {
      baseFee = appConfig.pricing.ep;
    } else if (type === ReleaseType.ALBUM) {
      baseFee = appConfig.pricing.album;
    }

    if (isGlobal) {
      const surplus = (baseFee * appConfig.pricing.globalDistributionSurplusPercent) / 100;
      return baseFee + surplus;
    }

    return baseFee;
  }

  async createRelease(userId: string, role: UserRole, data: CreateReleaseDTO) {
    let artistId: string | undefined;
    let labelId: string | undefined;

    if (role === UserRole.ARTIST) {
      const artist = await prisma.artistProfile.findUnique({
        where: { userId },
      });
      if (!artist) throw new Error('Profil artiste introuvable');
      artistId = artist.id;
    } else if (role === UserRole.LABEL) {
      const label = await prisma.labelProfile.findUnique({
        where: { userId },
      });
      if (!label) throw new Error('Profil label introuvable');
      labelId = label.id;
    }

    const fee = this.calculateDistributionFee(data.type, Boolean(data.isGlobalDistribution));

    const release = await prisma.release.create({
      data: {
        title: data.title,
        type: data.type,
        genre: data.genre,
        coverUrl: data.coverUrl,
        description: data.description,
        isGlobalDistribution: Boolean(data.isGlobalDistribution),
        distributionFeeXOF: fee,
        isDistributionPaid: false,
        artistId,
        labelId,
      },
    });

    return release;
  }

  async getReleaseById(id: string) {
    const release = await prisma.release.findUnique({
      where: { id },
      include: {
        artist: true,
        label: true,
        tracks: true,
      },
    });
    if (!release) throw new Error('Sortie introuvable');
    return release;
  }
}

export const releaseService = new ReleaseService();
