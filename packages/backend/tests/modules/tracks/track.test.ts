import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/app';
import { prisma } from '../../../src/database/prisma.service';
import { authService } from '../../../src/modules/auth/auth.service';
import { UserRole, ReleaseType } from '@prisma/client';

describe('Module Catalogue & Gestion des Titres', () => {
  const app = createApp();
  const artistToken = authService.generateToken('artist-user-1', UserRole.ARTIST);

  it('doit lister les titres avec l extrait public de 30 secondes', async () => {
    vi.spyOn(prisma.track, 'findMany').mockResolvedValue([
      {
        id: 'track-1',
        title: 'Farafina Beat',
        durationSeconds: 215,
        priceXOF: 300,
        audioPreviewUrl: 'https://cdn.cashplay.africa/previews/track-1.mp3',
        streamCount: 1540,
        saleCount: 82,
        release: {
          title: 'Renaissance',
          coverUrl: 'https://cdn.cashplay.africa/covers/release-1.jpg',
          genre: 'Afrobeats',
        },
        artist: {
          stageName: 'Amzy',
        },
      } as any,
    ]);

    const response = await request(app).get('/api/v1/tracks');
    expect(response.status).toBe(200);
    expect(response.body.tracks).toHaveLength(1);
    expect(response.body.tracks[0].title).toBe('Farafina Beat');
    expect(response.body.tracks[0].audioPreviewUrl).toBeDefined();
  });

  it('doit calculer le tarif de distribution exact (Single 2000 F, +30% si option globale = 2600 F)', async () => {
    vi.spyOn(prisma.artistProfile, 'findUnique').mockResolvedValue({
      id: 'artist-profile-1',
      userId: 'artist-user-1',
      stageName: 'Smarty',
    } as any);

    vi.spyOn(prisma.release, 'create').mockImplementation((args: any) => {
      return Promise.resolve({
        id: 'release-new-1',
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    const response = await request(app)
      .post('/api/v1/releases')
      .set('Authorization', `Bearer ${artistToken}`)
      .send({
        title: 'Nouvel Hymne',
        type: ReleaseType.SINGLE,
        genre: 'Hip-Hop',
        coverUrl: 'https://cdn.cashplay.africa/covers/hymne.jpg',
        isGlobalDistribution: true, // +30%
      });

    expect(response.status).toBe(201);
    expect(response.body.release.distributionFeeXOF).toBe(2600); // 2000 + 30% = 2600 FCFA
    expect(response.body.release.isGlobalDistribution).toBe(true);
  });

  it('doit supporter la création d un projet en prévente (J-14 à J-7 avant sortie)', async () => {
    vi.spyOn(prisma.artistProfile, 'findUnique').mockResolvedValue({
      id: 'artist-profile-1',
      userId: 'artist-user-1',
    } as any);

    const officialDate = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString();

    const response = await request(app)
      .post('/api/v1/releases')
      .set('Authorization', `Bearer ${artistToken}`)
      .send({
        title: 'Single Exclusif Prévente',
        type: ReleaseType.SINGLE,
        genre: 'Afrobeat',
        coverUrl: 'https://cdn.cashplay.africa/covers/exclu.jpg',
        isPreOrder: true,
        preOrderStartDate: new Date().toISOString(),
        officialReleaseDate: officialDate,
      });

    expect(response.status).toBe(201);
    expect(response.body.release.isPreOrder).toBe(true);
    expect(response.body.release.officialReleaseDate).toBeDefined();
  });
});
