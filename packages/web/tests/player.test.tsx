import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AudioProvider, useAudio } from '../src/context/AudioContext';

describe('Lecteur Audio & Gestion des Extraits (AudioContext)', () => {
  it('doit initialiser le lecteur à l état arrêté avec volume par défaut', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AudioProvider>{children}</AudioProvider>
    );
    const { result } = renderHook(() => useAudio(), { wrapper });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.volume).toBeGreaterThan(0);
    expect(result.current.show30SecConversionModal).toBe(false);
  });

  it('doit permettre de charger et changer le volume', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AudioProvider>{children}</AudioProvider>
    );
    const { result } = renderHook(() => useAudio(), { wrapper });

    act(() => {
      result.current.setVolume(0.5);
    });

    expect(result.current.volume).toBe(0.5);
  });
});
