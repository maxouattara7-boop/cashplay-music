'use client';

import React from 'react';
import { Play, Sparkles, TrendingUp, Music, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onDistributeClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onDistributeClick }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#006B2E]/40 via-zinc-950 to-black p-8 sm:p-12 border border-white/10 shadow-2xl">
      {/* Halo décoratif vert */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#008A3B]/20 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#006B2E]/20 blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#008A3B]/20 px-3.5 py-1.5 text-xs font-bold text-[#008A3B] border border-[#008A3B]/40 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
          <span>La plateforme musicale endogène africaine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
          Distribuer. Vendre. <span className="text-[#008A3B]">Écouter.</span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-300 font-medium">
          « La musique prend de la valeur. »
        </p>
        <p className="mt-2 text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
          Soutenez directement vos artistes préférés par <strong>Orange Money, Moov Money, Wave</strong> et cartes bancaires. Vente directe, préventes exclusives et rémunération équitable avec 80% reversés aux créateurs.
        </p>

        {/* Boutons d'action */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2.5 rounded-full bg-[#008A3B] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-[#008A3B]/40 hover:bg-[#006B2E] hover:scale-105 transition"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Écouter le Catalogue</span>
          </button>

          <button
            onClick={onDistributeClick}
            className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition"
          >
            <Music className="h-4 w-4 text-[#008A3B]" />
            <span>Vendre ma musique (dès 2 000 F)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Badges piliers */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#008A3B]" />
            <span>Vente Directe Mobile Money</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            <span>Préventes J-14 inédites</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span>Distribution Globale (+150 DSPs)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
