export interface DSPDeliveryTrack {
  id: string;
  isrc: string;
  title: string;
  durationSeconds: number;
  audioMasterUrl: string;
}

export interface DistributionPackage {
  releaseId: string;
  upc: string;
  title: string;
  artistName: string;
  type: string;
  genre: string;
  coverUrl: string;
  slaDeliveryDays: number;
  dspTargets: string[];
  tracks: DSPDeliveryTrack[];
  generatedAt: string;
}

export class DistributionExportService {
  private readonly defaultDSPs = [
    'Spotify',
    'Apple Music',
    'Deezer',
    'Boomplay',
    'Audiomack',
    'Amazon Music',
    'YouTube Music',
    'TikTok / ByteDance',
    'Meta (Instagram / Facebook)',
    'Tidal',
    'Anghami',
    '+140 autres plateformes partenaires',
  ];

  /**
   * Génération du manifeste de distribution globale conforme aux standards DDEX
   */
  generateDeliveryManifest(release: any): DistributionPackage {
    // Génération UPC/EAN (13 chiffres)
    const upc = `619${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const tracks: DSPDeliveryTrack[] = (release.tracks || []).map((t: any, index: number) => {
      // Génération ISRC standard (ex: BFCP2600001)
      const trackIndex = (index + 1).toString().padStart(4, '0');
      const isrc = `BFCP26${trackIndex}`;

      return {
        id: t.id,
        isrc,
        title: t.title,
        durationSeconds: t.durationSeconds,
        audioMasterUrl: t.audioMasterUrl,
      };
    });

    return {
      releaseId: release.id,
      upc,
      title: release.title,
      artistName: release.artist?.stageName || release.label?.labelName || 'Artiste CashPlay',
      type: release.type,
      genre: release.genre,
      coverUrl: release.coverUrl,
      slaDeliveryDays: 14, // Délai 14 jours stipulé dans le document de projet
      dspTargets: this.defaultDSPs,
      tracks,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const distributionExportService = new DistributionExportService();
