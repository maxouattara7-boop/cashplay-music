'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '../../components/navigation/Navbar';
import { AudioPlayer } from '../../components/player/AudioPlayer';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { ArrowLeft, Play, Pause, Gift, Users, Share2, Copy, Check, Music, Download } from 'lucide-react';

const myPurchasedTracks = [
  {
    id: 'purchased-1',
    title: 'Burkina Faso N°1 (Édition Prévente)',
    artistName: 'Amzy feat. Kayawoto',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    durationSeconds: 230,
    priceXOF: 500,
    purchaseDate: '12 Nov 2026',
  },
  {
    id: 'purchased-2',
    title: 'Dounia (Version Intégrale)',
    artistName: 'Floby',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    durationSeconds: 195,
    priceXOF: 200,
    purchaseDate: '10 Nov 2026',
  },
];

export default function MyLibraryPage() {
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || 'CASHPLAY-BF-77';
  const referralLink = `https://cashplay.africa/register?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-white pb-32">
      <Navbar user={user} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à l accueil</span>
        </Link>

        {/* Programme d'Affiliation & Viralité */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#006B2E]/60 via-zinc-900 to-black p-6 border border-[#008A3B]/30 shadow-xl mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-bold text-yellow-400 border border-yellow-400/30 mb-2">
                <Gift className="h-3.5 w-3.5" />
                <span>Programme de Parrainage CashPlay</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Partagez l'application, gagnez de la musique !
              </h2>
              <p className="mt-1 text-xs text-gray-300 leading-relaxed">
                Invitez vos proches avec votre lien unique. Dès que <strong>5 personnes</strong> créent un compte et achètent un son, vous gagnez automatiquement <strong>1 téléchargement gratuit</strong> de votre choix !
              </p>

              {/* Jauge de progression */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#008A3B] h-full rounded-full w-3/5" />
                </div>
                <span className="text-xs font-bold text-white whitespace-nowrap">3 / 5 acheteurs</span>
              </div>
            </div>

            {/* Boîte Lien de Partage */}
            <div className="flex flex-col gap-2 min-w-[260px] rounded-xl bg-black/60 p-4 border border-white/10">
              <span className="text-[11px] font-semibold text-gray-400">Votre lien d'affiliation :</span>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-2 text-xs font-mono text-[#008A3B]">
                <span className="truncate max-w-[180px]">{referralLink}</span>
                <button onClick={copyToClipboard} className="text-gray-300 hover:text-white ml-2">
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex gap-2 mt-1">
                <a
                  href={`https://wa.me/?text=Découvre%20CashPlay%20Music%20et%20écoute%20nos%20artistes%20africains%20:%20${referralLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-lg bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 py-1.5 text-center text-xs font-bold hover:bg-[#25D366]/30 transition"
                >
                  WhatsApp
                </a>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 rounded-lg bg-white/10 text-white py-1.5 text-center text-xs font-bold hover:bg-white/20 transition"
                >
                  {copied ? 'Copié !' : 'Copier'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bibliothèque « Mes Sons » */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-[#008A3B]" />
              <h2 className="text-xl font-black text-white">Mes Sons Achetés</h2>
            </div>
            <span className="text-xs text-gray-400">{myPurchasedTracks.length} titres acquis</span>
          </div>

          <div className="space-y-3">
            {myPurchasedTracks.map((track) => {
              const isThisPlaying = isPlaying && currentTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-zinc-900/70 border border-white/5 p-3.5 hover:border-[#008A3B]/30 hover:bg-zinc-800/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        playTrack({
                          id: track.id,
                          title: track.title,
                          artistName: track.artistName,
                          coverUrl: track.coverUrl,
                          audioUrl: track.audioUrl,
                          durationSeconds: track.durationSeconds,
                          priceXOF: track.priceXOF,
                          isPreview: false,
                          isPurchased: true,
                        })
                      }
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#008A3B] text-white shadow hover:scale-105 hover:bg-[#006B2E] transition"
                    >
                      {isThisPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                    </button>

                    <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                      <Image src={track.coverUrl} alt={track.title} fill className="object-cover" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{track.title}</h4>
                      <p className="text-xs text-gray-400">{track.artistName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="hidden sm:inline">Acheté le {track.purchaseDate}</span>
                    <button
                      onClick={() => alert('Mode hors-ligne : titre sécurisé dans votre cache local.')}
                      className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-medium text-white hover:bg-[#008A3B] transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Hors-ligne</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <AudioPlayer />
    </div>
  );
}
