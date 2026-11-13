import { describe, it, expect } from 'vitest';
import { DistributionExportService } from '../../../src/modules/admin/distribution-export.service';

describe('Moteur d Export pour la Distribution Globale (+150 DSPs)', () => {
  const service = new DistributionExportService();

  it('doit générer un package de distribution normalisé avec UPC, ISRC et cibles DSPs', () => {
    const releaseMock = {
      id: 'rel-global-1',
      title: 'Renaissance Africaine',
      type: 'EP',
      genre: 'Afrobeats',
      coverUrl: 'https://cdn.cashplay.africa/covers/album.jpg',
      isGlobalDistribution: true,
      artist: { stageName: 'Amzy' },
      tracks: [
        { id: 'trk-1', title: 'Intro', durationSeconds: 65, audioMasterUrl: 'https://cdn.cashplay.africa/masters/1.mp3' },
        { id: 'trk-2', title: 'Farafina', durationSeconds: 210, audioMasterUrl: 'https://cdn.cashplay.africa/masters/2.mp3' },
      ],
    };

    const pkg = service.generateDeliveryManifest(releaseMock as any);

    expect(pkg.releaseId).toBe('rel-global-1');
    expect(pkg.upc).toBeDefined();
    expect(pkg.upc.length).toBeGreaterThan(10);
    expect(pkg.tracks).toHaveLength(2);
    expect(pkg.tracks[0].isrc).toContain('BFCP');
    expect(pkg.dspTargets).toContain('Spotify');
    expect(pkg.dspTargets).toContain('Apple Music');
    expect(pkg.dspTargets).toContain('Boomplay');
    expect(pkg.dspTargets).toContain('Deezer');
    expect(pkg.slaDeliveryDays).toBe(14); // 14 jours indiqués dans le document
  });
});
