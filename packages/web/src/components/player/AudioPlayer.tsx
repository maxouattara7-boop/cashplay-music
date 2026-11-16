'use client';

import React from 'react';
import Image from 'next/image';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ShoppingBag, Sparkles } from 'lucide-react';

interface AudioPlayerProps {
  onBuyTrack?: (trackId: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ onBuyTrack }) => {
  const { currentTrack, isPlaying, progress, duration, togglePlay, seek, volume, setVolume } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 px-4 py-3 backdrop-blur-xl shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Infos Titre & Vinyle animé avec Logo CashPlay */}
        <div className="flex items-center gap-3 w-1/3 min-w-[240px]">
          {/* Disque Vinyle Rotatif avec Logo CashPlay */}
          <div
            className={`relative h-12 w-12 flex-shrink-0 rounded-full border-2 border-[#F59E0B] bg-black p-1 shadow-lg shadow-[#008A3B]/20 transition-all ${
              isPlaying ? 'animate-[spin_5s_linear_infinite]' : ''
            }`}
            title="Disque CashPlay en lecture"
          >
            <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
              <Image
                src="/cashplay-logo.jpg"
                alt="Logo CashPlay Music"
                fill
                className="object-contain p-0.5"
              />
            </div>
            {/* Centre vinyle acoustique */}
            <div className="absolute inset-0 m-auto h-2 w-2 rounded-full border border-zinc-900 bg-[#F59E0B]" />
          </div>

          {/* Pochette Album & Infos */}
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-zinc-800 shadow-inner">
              {currentTrack.coverUrl ? (
                <Image
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#006B2E] text-white font-bold text-xs">
                  CP
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h4 className="truncate text-sm font-bold text-white">{currentTrack.title}</h4>
                {currentTrack.isPreview && (
                  <span className="rounded bg-yellow-500/20 px-1 py-0.2 text-[9px] font-semibold text-yellow-400 border border-yellow-500/30">
                    Extrait 30s
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-gray-400">{currentTrack.artistName}</p>
            </div>
          </div>
        </div>

        {/* Contrôles de Lecture & Barre de Progression */}
        <div className="flex flex-1 flex-col items-center max-w-2xl">
          <div className="flex items-center gap-5 mb-1.5">
            <button className="text-gray-400 hover:text-white transition">
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#008A3B] text-white shadow-lg shadow-[#008A3B]/40 hover:bg-[#006B2E] hover:scale-105 transition"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </button>
            <button className="text-gray-400 hover:text-white transition">
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          <div className="flex w-full items-center gap-3">
            <span className="text-[11px] font-medium text-gray-400 w-8 text-right">
              {formatTime(progress)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-[#008A3B]"
            />
            <span className="text-[11px] font-medium text-gray-400 w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Bouton Achat / Volume */}
        <div className="flex items-center justify-end gap-4 w-1/4 min-w-[200px]">
          {currentTrack.isPreview && !currentTrack.isPurchased && (
            <button
              onClick={() => onBuyTrack && onBuyTrack(currentTrack.id)}
              className="flex items-center gap-1.5 rounded-full bg-[#008A3B] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-[#006B2E] transition"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Acheter ({currentTrack.priceXOF} F)</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
              className="text-gray-400 hover:text-white"
            >
              {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 h-1 cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-[#008A3B]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
