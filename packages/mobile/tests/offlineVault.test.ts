import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineVaultService } from '../src/services/offlineVault.service';

describe('Module de Téléchargement Hors-Ligne Chiffré Anti-Piratage (Offline Vault)', () => {
  let vault: OfflineVaultService;

  beforeEach(() => {
    vault = new OfflineVaultService();
  });

  it('doit chiffrer et stocker un morceau dans le coffre-fort sécurisé', async () => {
    const rawAudioBuffer = Buffer.from('FAKE_MP3_AUDIO_STREAM_DATA_CASHPLAY_AFRICA_2026');
    const trackId = 'track-offline-001';

    const savedPath = await vault.storeEncryptedTrack(trackId, {
      title: 'Burkina Faso N°1',
      artistName: 'Amzy',
      durationSeconds: 230,
      priceXOF: 500,
    }, rawAudioBuffer);

    expect(savedPath).toContain(trackId);
    expect(savedPath.endsWith('.cpm')).toBe(true); // Fichier scellé propriétaire CashPlay Music
    expect(vault.isDownloaded(trackId)).toBe(true);
  });

  it('doit s assurer que le fichier sur disque est chiffré et non lisible en clair comme un MP3 ordinaire', async () => {
    const rawAudio = Buffer.from('ID3_HEADER_PURE_MUSIC_DATA_XYZ');
    const trackId = 'track-offline-002';

    await vault.storeEncryptedTrack(trackId, {
      title: 'Dankan',
      artistName: 'Smarty',
      durationSeconds: 200,
      priceXOF: 300,
    }, rawAudio);

    const rawEncryptedDiskData = vault.getRawEncryptedBytes(trackId);
    // Le contenu brut stocké ne doit PAS être égal au son en clair
    expect(rawEncryptedDiskData).not.toEqual(rawAudio);
    expect(rawEncryptedDiskData.includes(Buffer.from('ID3_HEADER_PURE_MUSIC_DATA_XYZ'))).toBe(false);

    // Déchiffrement in-memory pour lecture dans l'app CashPlay uniquement
    const decrypted = vault.getDecryptedBytes(trackId);
    expect(decrypted).toEqual(rawAudio);
  });

  it('doit lister tous les morceaux disponibles en mode hors-ligne sans connexion Internet', async () => {
    vault.storeEncryptedTrack('t1', { title: 'Song 1', artistName: 'Art 1', durationSeconds: 180, priceXOF: 200 }, Buffer.from('a'));
    vault.storeEncryptedTrack('t2', { title: 'Song 2', artistName: 'Art 2', durationSeconds: 210, priceXOF: 300 }, Buffer.from('b'));

    const list = vault.getOfflineTracks();
    expect(list).toHaveLength(2);
    expect(list.map(t => t.title)).toContain('Song 1');
    expect(list.map(t => t.title)).toContain('Song 2');
  });
});
