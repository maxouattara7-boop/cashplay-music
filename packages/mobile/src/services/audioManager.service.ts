export interface MobileTrack {
  id: string;
  title: string;
  artistName: string;
  coverUrl: string;
  audioUri: string;
  durationSeconds: number;
  isPreview: boolean;
  isOfflineEncrypted?: boolean;
}

export class MobileAudioManager {
  private currentTrack: MobileTrack | null = null;
  private playing = false;
  private backgroundActive = false;
  private accumulatedSeconds = 0;
  private prompt30SecShown = false;

  loadTrack(track: MobileTrack) {
    this.currentTrack = track;
    this.playing = false;
  }

  play() {
    if (!this.currentTrack) return;
    this.playing = true;
    this.backgroundActive = true;
  }

  pause() {
    this.playing = false;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  getCurrentTrack(): MobileTrack | null {
    return this.currentTrack;
  }

  isBackgroundServiceActive(): boolean {
    return this.backgroundActive;
  }

  simulateListeningSeconds(seconds: number) {
    if (this.playing && this.currentTrack?.isPreview) {
      this.accumulatedSeconds += seconds;
    }
  }

  shouldShow30SecondConversionModal(): boolean {
    if (this.accumulatedSeconds >= 30 && !this.prompt30SecShown) {
      this.prompt30SecShown = true;
      return true;
    }
    return false;
  }

  dismiss30SecModal() {
    this.prompt30SecShown = true;
  }
}

export const mobileAudio = new MobileAudioManager();
