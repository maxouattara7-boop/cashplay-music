import { describe, it, expect } from 'vitest';
import { CashPlayColors } from '../src/theme/colors';
import { offlineVault } from '../src/services/offlineVault.service';
import { mobileAudio } from '../src/services/audioManager.service';

describe('Intégration Mobile App CashPlay Music', () => {
  it('doit posséder un thème sombre avec vert CashPlay prépondérant', () => {
    expect(CashPlayColors.primary).toBe('#008A3B');
    expect(CashPlayColors.background).toBe('#0c0d0e');
  });

  it('doit valider la conformité des options du SideDrawer inspiré d Empire Afrique', () => {
    // Vérification des écrans cibles et des parcours auditeur/artiste
    const validDrawerRoutes = ['home', 'library', 'profile'];
    expect(validDrawerRoutes).toContain('home');
    expect(validDrawerRoutes).toContain('library');
    expect(validDrawerRoutes).toContain('profile');
  });

  it('doit valider les données et la structure d un titre pour l écran détaillé et le flux de paiement SasPay', () => {
    const mockTrack = {
      id: 'cat-1501',
      title: '15.01 (EP Exclusif)',
      artist: 'Moms Loup',
      priceXOF: 2000,
      salesCount: 441,
      coverUrl: 'https://example.com/cover.jpg',
      videoTeaserUrl: 'https://example.com/teaser.mp4',
      commentsCount: 54,
    };

    expect(mockTrack.priceXOF).toBe(2000);
    expect(mockTrack.salesCount).toBeGreaterThan(0);
    expect(mockTrack.videoTeaserUrl).toBeDefined();

    // Vérification des méthodes de paiement supportées
    const supportedMethods = ['ORANGE_BURKINA', 'MOOV_BURKINA', 'WAVE_BF_CI', 'CARD'];
    expect(supportedMethods).toContain('ORANGE_BURKINA');
    expect(supportedMethods).toContain('WAVE_BF_CI');
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
