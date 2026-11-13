'use client';

import React, { useState } from 'react';
import { X, Globe, Download, Check, Sparkles, Music, Calendar } from 'lucide-react';

interface DistributionExportModalProps {
  release: any | null;
  onClose: () => void;
}

export const DistributionExportModal: React.FC<DistributionExportModalProps> = ({ release, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!release) return null;

  const manifest = {
    releaseId: release.id,
    upc: `6198${Math.floor(100000000 + Math.random() * 900000000)}`,
    title: release.title,
    artist: release.artistName || 'Artiste CashPlay',
    genre: release.genre || 'Afrobeats',
    format: release.type || 'SINGLE',
    deliverySLA: '14 jours',
    dspTargets: [
      'Spotify',
      'Apple Music',
      'Deezer',
      'Boomplay',
      'Audiomack',
      'Amazon Music',
      'YouTube Music',
      'TikTok / ByteDance',
      '+140 autres plateformes internationales',
    ],
    generatedAt: new Date().toISOString(),
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DDEX_DISTRIBUTION_${release.title.replace(/\s+/g, '_')}_UPC.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#008A3B]/40 bg-zinc-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#008A3B]/20 text-[#008A3B]">
            <Globe className="h-4 w-4" />
          </span>
          <h3 className="text-lg font-black text-white">Export Distribution Globale (+150 DSPs)</h3>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Génération du package de livraison DDEX normalisé pour déploiement mondial sous 14 jours.
        </p>

        {/* Détails du projet */}
        <div className="mt-4 rounded-xl bg-white/5 p-4 border border-white/5 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Projet musical :</span>
            <span className="font-bold text-white">{release.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Artiste / Label :</span>
            <span className="font-bold text-[#008A3B]">{release.artistName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Code UPC/EAN attribué :</span>
            <span className="font-mono text-yellow-400">{manifest.upc}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Délai d'acheminement (SLA) :</span>
            <span className="font-semibold text-white">14 jours ouvrés</span>
          </div>
        </div>

        {/* Plateformes cibles */}
        <div className="mt-4">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Plateformes connectées (+150 DSPs) :
          </span>
          <div className="flex flex-wrap gap-1.5">
            {manifest.dspTargets.map((dsp) => (
              <span
                key={dsp}
                className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-gray-300"
              >
                {dsp}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white"
          >
            Fermer
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl bg-[#008A3B] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#008A3B]/30 hover:bg-[#006B2E] transition"
          >
            {downloaded ? <Check className="h-4 w-4 text-green-300" /> : <Download className="h-4 w-4" />}
            <span>{downloaded ? 'Package Téléchargé !' : 'Télécharger Manifeste DDEX (JSON)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
