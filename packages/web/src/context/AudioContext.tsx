'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export interface AudioTrack {
  id: string;
  title: string;
  artistName: string;
  coverUrl: string;
  audioUrl: string;
  durationSeconds: number;
  priceXOF: number;
  isPreview: boolean;
  isPurchased?: boolean;
}

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  accumulatedListenSeconds: number;
  show30SecConversionModal: boolean;
  playTrack: (track: AudioTrack) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (level: number) => void;
  close30SecModal: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [accumulatedListenSeconds, setAccumulatedListenSeconds] = useState(0);
  const [show30SecConversionModal, setShow30SecConversionModal] = useState(false);
  const [hasPrompted30Sec, setHasPrompted30Sec] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
          setDuration(audioRef.current.duration || 0);
        }
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Décompte des 30 secondes d'écoute cumulée pour les visiteurs anonymes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentTrack?.isPreview && !hasPrompted30Sec) {
      timer = setInterval(() => {
        setAccumulatedListenSeconds((prev) => {
          const nextVal = prev + 1;
          if (nextVal >= 30) {
            setShow30SecConversionModal(true);
            setHasPrompted30Sec(true);
          }
          return nextVal;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isPlaying, currentTrack, hasPrompted30Sec]);

  const playTrack = (track: AudioTrack) => {
    if (!audioRef.current) return;

    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    setCurrentTrack(track);
    audioRef.current.src = track.audioUrl;
    audioRef.current.load();
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.log('Audio autoplay prevented:', err));
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Playback error:', err));
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgress(seconds);
    }
  };

  const setVolume = (level: number) => {
    setVolumeState(level);
    if (audioRef.current) {
      audioRef.current.volume = level;
    }
  };

  const close30SecModal = () => {
    setShow30SecConversionModal(false);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        accumulatedListenSeconds,
        show30SecConversionModal,
        playTrack,
        togglePlay,
        seek,
        setVolume,
        close30SecModal,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio doit être utilisé à l intérieur d un AudioProvider');
  }
  return context;
};
