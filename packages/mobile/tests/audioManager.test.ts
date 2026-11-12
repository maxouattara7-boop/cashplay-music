import { describe, it, expect, beforeEach } from 'vitest';
import { MobileAudioManager } from '../src/services/audioManager.service';

describe('Service Audio Mobile & Lecture en Arrière-Plan', () => {
  let audioManager: MobileAudioManager;

  beforeEach(() => {
    audioManager = new MobileAudioManager();
  });

  it('doit démarrer la lecture en arrière-plan avec les métadonnées pour l écran de verrouillage', () => {
    audioManager.loadTrack({
      id: 'track-mob-1',
      title: 'Farafina Beat',
      artistName: 'Amzy',
      coverUrl: 'https://cdn.cashplay.africa/covers/track.jpg',
      audioUri: 'https://cdn.cashplay.africa/audio/track.mp3',
      durationSeconds: 215,
      isPreview: false,
    });

    audioManager.play();

    expect(audioManager.isPlaying()).toBe(true);
    expect(audioManager.getCurrentTrack()?.title).toBe('Farafina Beat');
    expect(audioManager.isBackgroundServiceActive()).toBe(true);
  });

  it('doit déclencher l alerte de conversion après 30 secondes d écoute anonyme d extrait', () => {
    audioManager.loadTrack({
      id: 'preview-1',
      title: 'Extrait Nouveauté',
      artistName: 'Smarty',
      coverUrl: '',
      audioUri: 'https://cdn.cashplay.africa/previews/1.mp3',
      durationSeconds: 30,
      isPreview: true,
    });

    audioManager.play();
    audioManager.simulateListeningSeconds(30);

    expect(audioManager.shouldShow30SecondConversionModal()).toBe(true);
  });
});
