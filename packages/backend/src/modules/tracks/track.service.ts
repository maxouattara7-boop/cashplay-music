import { prisma } from '../../database/prisma.service';

export interface CreateTrackDTO {
  releaseId: string;
  title: string;
  durationSeconds: number;
  trackNumber?: number;
  priceXOF?: number;
  audioMasterUrl: string;
  audioPreviewUrl: string;
}

export class TrackService {
  async getPublicTracks(query?: { genre?: string; search?: string; limit?: number }) {
    const where: any = {};
    if (query?.genre) {
      where.release = { genre: { equals: query.genre, mode: 'insensitive' } };
    }
    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { artist: { stageName: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const tracks = await prisma.track.findMany({
      where,
      take: query?.limit || 50,
      include: {
        artist: { select: { stageName: true, photoProUrl: true } },
        release: { select: { title: true, coverUrl: true, genre: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tracks;
  }

  async getTrackById(id: string) {
    const track = await prisma.track.findUnique({
      where: { id },
      include: {
        artist: true,
        release: true,
      },
    });
    if (!track) throw new Error('Titre introuvable');
    return track;
  }

  async createTrack(artistUserId: string, data: CreateTrackDTO) {
    const artist = await prisma.artistProfile.findUnique({
      where: { userId: artistUserId },
    });

    const track = await prisma.track.create({
      data: {
        releaseId: data.releaseId,
        artistId: artist?.id,
        title: data.title,
        durationSeconds: data.durationSeconds,
        trackNumber: data.trackNumber || 1,
        priceXOF: data.priceXOF || 200,
        audioMasterUrl: data.audioMasterUrl,
        audioPreviewUrl: data.audioPreviewUrl,
      },
    });

    return track;
  }
}

export const trackService = new TrackService();
