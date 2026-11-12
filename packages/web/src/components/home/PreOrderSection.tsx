'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Calendar, Play, ShoppingBag, Clock } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export interface PreOrderItem {
  id: string;
  title: string;
  artistName: string;
  coverUrl: string;
  genre: string;
  priceXOF: number;
  previewUrl: string;
  daysRemaining: number;
  officialDateFormatted: string;
}

interface PreOrderSectionProps {
  items: PreOrderItem[];
  onPreOrderClick: (item: PreOrderItem) => void;
}

export const PreOrderSection: React.FC<PreOrderSectionProps> = ({ items, onPreOrderClick }) => {
  const { playTrack, currentTrack, isPlaying } = useAudio();

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-400">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Exclusivités & Préventes
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Découvrez et soutenez les titres inédits 1 à 2 semaines avant leur sortie officielle (J-14 à J-7)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isThisPlaying = isPlaying && currentTrack?.id === item.id;

          return (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-yellow-500/30 p-4 transition-all duration-300 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-500/10"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-800">
                <Image
                  src={item.coverUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />

                {/* Badge Prévente */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-bold text-yellow-400 backdrop-blur-md border border-yellow-500/40">
                  <Clock className="h-3 w-3" />
                  <span>J - {item.daysRemaining} jours</span>
                </div>

                {/* Bouton Play Preview */}
                <button
                  onClick={() =>
                    playTrack({
                      id: item.id,
                      title: item.title,
                      artistName: item.artistName,
                      coverUrl: item.coverUrl,
                      audioUrl: item.previewUrl,
                      durationSeconds: 30,
                      priceXOF: item.priceXOF,
                      isPreview: true,
                    })
                  }
                  className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#008A3B] text-white shadow-xl shadow-black/60 transition hover:scale-110 hover:bg-[#006B2E]"
                >
                  <Play className={`h-5 w-5 fill-current ml-0.5 ${isThisPlaying ? 'animate-pulse text-yellow-300' : ''}`} />
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-semibold text-[#008A3B]">{item.genre}</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="h-3 w-3" />
                    Sortie : {item.officialDateFormatted}
                  </span>
                </div>

                <h3 className="mt-1 truncate text-base font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="truncate text-xs text-gray-300">{item.artistName}</p>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 font-semibold block">Prix Prévente</span>
                    <span className="text-sm font-black text-white">{item.priceXOF} F CFA</span>
                  </div>

                  <button
                    onClick={() => onPreOrderClick(item)}
                    className="flex items-center gap-1.5 rounded-full bg-yellow-400 px-4 py-2 text-xs font-bold text-black shadow-md hover:bg-yellow-300 transition"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Précommander</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
