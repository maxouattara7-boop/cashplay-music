'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Pause, ShoppingBag, Heart, Share2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export interface CatalogTrackItem {
  id: string;
  title: string;
  artistName: string;
  coverUrl: string;
  genre: string;
  priceXOF: number;
  previewUrl: string;
  streamCount?: number;
}

interface TrackCardProps {
  track: CatalogTrackItem;
  onBuyClick: (track: CatalogTrackItem) => void;
  onOpenDetail?: (track: CatalogTrackItem) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, onBuyClick, onOpenDetail }) => {
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const isThisPlaying = isPlaying && currentTrack?.id === track.id;

  return (
    <div
      onClick={() => onOpenDetail && onOpenDetail(track)}
      className="group relative cursor-pointer rounded-xl bg-zinc-900/80 border border-white/5 p-3.5 transition-all duration-300 hover:border-[#008A3B]/40 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-[#008A3B]/10"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-800">
        <Image
          src={track.coverUrl}
          alt={track.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Bouton Play Extrait Overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playTrack({
              id: track.id,
              title: track.title,
              artistName: track.artistName,
              coverUrl: track.coverUrl,
              audioUrl: track.previewUrl,
              durationSeconds: 30,
              priceXOF: track.priceXOF,
              isPreview: true,
            });
          }}
          className={`absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#008A3B] text-white shadow-lg shadow-black/50 transition-all duration-200 hover:scale-110 hover:bg-[#006B2E] ${
            isThisPlaying ? 'opacity-100 ring-2 ring-white' : 'opacity-90 sm:opacity-0 group-hover:opacity-100'
          }`}
          title="Écouter l extrait 30s"
        >
          {isThisPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span className="font-semibold text-[#008A3B] uppercase">{track.genre}</span>
          <span>{track.priceXOF} F CFA</span>
        </div>

        <h4 className="mt-1 truncate text-sm font-bold text-white group-hover:text-[#008A3B] transition">
          {track.title}
        </h4>
        <p className="truncate text-xs text-gray-400">{track.artistName}</p>

        {/* Action Achat */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBuyClick(track);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#008A3B] transition"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Acheter</span>
          </button>

          <div className="flex items-center gap-1 text-gray-400">
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="p-1 hover:text-red-400 transition"
              title="Aimer"
            >
              <Heart className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="p-1 hover:text-white transition"
              title="Partager"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
