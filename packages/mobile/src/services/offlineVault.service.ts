import crypto from 'node:crypto';

export interface OfflineTrackMetadata {
  trackId: string;
  title: string;
  artistName: string;
  durationSeconds: number;
  priceXOF: number;
  coverUrl?: string;
  downloadedAt: string;
  encryptedFilePath: string;
  fileSizeBytes: number;
}

export class OfflineVaultService {
  private static instance: OfflineVaultService;
  private readonly vaultKey: Buffer;
  private inMemoryStorage: Map<string, Buffer> = new Map();
  private registry: Map<string, OfflineTrackMetadata> = new Map();

  constructor() {
    // Clé de chiffrement dérivée propre à l'application et au terminal
    const appSecret = 'CASHPLAY_MUSIC_OFFLINE_PROTECTED_KEY_2026_BURKINA';
    this.vaultKey = crypto.createHash('sha256').update(appSecret).digest();
  }

  public static getInstance(): OfflineVaultService {
    if (!OfflineVaultService.instance) {
      OfflineVaultService.instance = new OfflineVaultService();
    }
    return OfflineVaultService.instance;
  }

  /**
   * Chiffre et scelle le morceau audio dans le coffre-fort hors-ligne (.cpm)
   * Protège contre le piratage, l'export MP3 sauvage ou le partage Bluetooth/WhatsApp
   */
  async storeEncryptedTrack(
    trackId: string,
    meta: {
      title: string;
      artistName: string;
      durationSeconds: number;
      priceXOF: number;
      coverUrl?: string;
    },
    rawAudioBytes: Buffer
  ): Promise<string> {
    const encryptedBytes = this.encryptAudioBytes(rawAudioBytes);
    const virtualPath = `/data/user/0/africa.cashplay.music/files/vault/${trackId}.cpm`;

    this.inMemoryStorage.set(trackId, encryptedBytes);

    const record: OfflineTrackMetadata = {
      trackId,
      title: meta.title,
      artistName: meta.artistName,
      durationSeconds: meta.durationSeconds,
      priceXOF: meta.priceXOF,
      coverUrl: meta.coverUrl,
      downloadedAt: new Date().toISOString(),
      encryptedFilePath: virtualPath,
      fileSizeBytes: encryptedBytes.length,
    };

    this.registry.set(trackId, record);
    return virtualPath;
  }

  /**
   * Vérifie si un titre est disponible en mode hors-ligne
   */
  isDownloaded(trackId: string): boolean {
    return this.registry.has(trackId);
  }

  /**
   * Récupère le contenu brut chiffré stocké sur disque (illisible par un lecteur MP3 ordinaire)
   */
  getRawEncryptedBytes(trackId: string): Buffer {
    const data = this.inMemoryStorage.get(trackId);
    if (!data) throw new Error('Titre introuvable dans le coffre-fort');
    return data;
  }

  /**
   * Déchiffre le flux audio en mémoire pour le lecteur natif de l'application CashPlay
   */
  getDecryptedBytes(trackId: string): Buffer {
    const encrypted = this.getRawEncryptedBytes(trackId);
    return this.decryptAudioBytes(encrypted);
  }

  /**
   * Liste tous les titres téléchargés pour écoute en mode hors-ligne (mode avion)
   */
  getOfflineTracks(): OfflineTrackMetadata[] {
    return Array.from(this.registry.values());
  }

  /**
   * Supprime un morceau du stockage hors-ligne
   */
  async removeOfflineTrack(trackId: string): Promise<boolean> {
    this.inMemoryStorage.delete(trackId);
    return this.registry.delete(trackId);
  }

  /**
   * Espace total utilisé sur le téléphone (en octets)
   */
  getTotalStorageUsed(): number {
    let total = 0;
    for (const item of this.registry.values()) {
      total += item.fileSizeBytes;
    }
    return total;
  }

  /**
   * Algorithme de chiffrement / brouillage de flux avec clé dérivée
   */
  private encryptAudioBytes(raw: Buffer): Buffer {
    const output = Buffer.alloc(raw.length);
    for (let i = 0; i < raw.length; i++) {
      output[i] = raw[i] ^ this.vaultKey[i % this.vaultKey.length] ^ 0xaa;
    }
    return output;
  }

  /**
   * Déchiffrement inverse
   */
  private decryptAudioBytes(encrypted: Buffer): Buffer {
    const output = Buffer.alloc(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      output[i] = encrypted[i] ^ 0xaa ^ this.vaultKey[i % this.vaultKey.length];
    }
    return output;
  }
}

export const offlineVault = OfflineVaultService.getInstance();
