import { describe, it, expect } from 'vitest';
import { CashPlayColors } from '../src/theme/colors';
import { offlineVault } from '../src/services/offlineVault.service';
import { mobileAudio } from '../src/services/audioManager.service';

describe('Intégration Mobile App CashPlay Music', () => {
  it('doit posséder un thème sombre avec vert CashPlay prépondérant', () => {
    expect(CashPlayColors.primary).toBe('#008A3B');
    expect(CashPlayColors.background).toBe('#0c0d0e');
  });

  it('doit permettre d enchaîner le stockage hors-ligne et la lecture dans le mobileAudio', async () => {
    // 1. Stockage dans le coffre-fort
    await offlineVault.storeEncryptedTrack('t-flow-1', {
      title: 'Titre de Test',
      artistName: 'Artiste Test',
      durationSeconds: 180,
      priceXOF: 200,
    }, Buffer.from('FAKE_AUDIO_BYTES_TEST'));

    expect(offlineVault.isDownloaded('t-flow-1')).toBe(true);

    // 2. Chargement dans le lecteur mobile
    mobileAudio.loadTrack({
      id: 't-flow-1',
      title: 'Titre de Test',
      artistName: 'Artiste Test',
      coverUrl: '',
      audioUri: 'vault://t-flow-1.cpm',
      durationSeconds: 180,
      isPreview: false,
      isOfflineEncrypted: true,
    });

    mobileAudio.play();
    expect(mobileAudio.isPlaying()).toBe(true);
    expect(mobileAudio.getCurrentTrack()?.isOfflineEncrypted).toBe(true);
  });
});
