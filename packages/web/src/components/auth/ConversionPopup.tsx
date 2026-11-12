'use client';

import React from 'react';
import Image from 'next/image';
import { X, Sparkles, Music, ShieldCheck, ArrowRight } from 'lucide-react';

interface ConversionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

export const ConversionPopup: React.FC<ConversionPopupProps> = ({ isOpen, onClose, onOpenRegister }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#008A3B]/40 bg-zinc-950 p-6 shadow-2xl shadow-[#008A3B]/20">
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo & Accroche */}
        <div className="flex flex-col items-center text-center">
          <div className="relative h-14 w-40 mb-3">
            <Image
              src="/logo CashPlay Music vert blanc.png"
              alt="CashPlay Music"
              fill
              className="object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#008A3B]/20 px-3 py-1 text-xs font-semibold text-[#008A3B] border border-[#008A3B]/30 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
            <span>Votre extrait se termine</span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            La musique prend de la valeur.
          </h3>
          <p className="mt-2 text-xs text-gray-300 leading-relaxed">
            Créez votre compte en 30 secondes pour acheter vos titres préférés par <span className="text-[#008A3B] font-semibold">Mobile Money</span> (Orange, Moov, Wave) et profiter d'une écoute illimitée même hors-ligne.
          </p>
        </div>

        {/* Avantages clés */}
        <div className="mt-5 space-y-2 rounded-xl bg-white/5 p-3.5 text-xs">
          <div className="flex items-center gap-2.5 text-gray-200">
            <Music className="h-4 w-4 text-[#008A3B] flex-shrink-0" />
            <span>Écoute in-app complète et répétée sans coupure</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-200">
            <ShieldCheck className="h-4 w-4 text-[#008A3B] flex-shrink-0" />
            <span>Paiement direct sécurisé : 80% reversés à l'artiste</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-200">
            <Sparkles className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            <span>Parrainez 5 amis et recevez 1 titre gratuit</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008A3B] py-3 text-sm font-bold text-white shadow-lg shadow-[#008A3B]/30 hover:bg-[#006B2E] transition"
          >
            <span>Créer mon compte gratuitement</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="text-xs font-medium text-gray-400 hover:text-white transition py-1"
          >
            Continuer la découverte
          </button>
        </div>
      </div>
    </div>
  );
};
