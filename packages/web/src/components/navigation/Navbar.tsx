'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Music, Sparkles, User, ShoppingBag, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: () => void;
  user?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, user }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Slogan */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl border border-[#008A3B]/40 bg-white p-0.5 shadow-md shadow-[#008A3B]/20 transition-transform group-hover:scale-105">
            <Image
              src="/cashplay-logo.jpg"
              alt="CashPlay Music"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white group-hover:text-[#008A3B] transition-colors">
              CashPlay <span className="text-[#008A3B]">MUSIC</span>
            </span>
            <span className="text-[10px] font-medium text-gray-400 -mt-0.5 hidden xs:inline">
              La musique prend de la valeur.
            </span>
          </div>
        </Link>

        {/* Barre de Recherche */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher artistes, titres, albums, afrobeats..."
              className="w-full rounded-full bg-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
            />
          </div>
        </div>

        {/* Liens & Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href="/pre-orders"
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#008A3B]/10 px-3.5 py-1.5 text-xs font-semibold text-[#008A3B] border border-[#008A3B]/30 hover:bg-[#008A3B]/20 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
            <span>Préventes J-14</span>
          </Link>

          <Link
            href="/my-library"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white transition px-2 py-1"
          >
            <Music className="h-4 w-4 text-[#008A3B]" />
            <span className="hidden sm:inline">Mes Sons</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'ARTIST' && (
                <Link
                  href="/dashboard/artist"
                  className="rounded-lg bg-[#008A3B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#006B2E] transition"
                >
                  Espace Artiste
                </Link>
              )}
              {user.role === 'LABEL' && (
                <Link
                  href="/dashboard/label"
                  className="rounded-lg bg-[#008A3B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#006B2E] transition"
                >
                  Espace Label
                </Link>
              )}
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs border border-white/5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#008A3B] text-[10px] font-bold text-white">
                  {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'CP'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-white leading-tight">{user.fullName || 'Mon Compte'}</span>
                  <span className="text-[9px] text-[#008A3B] font-medium leading-none">
                    {user.role === 'ARTIST' ? 'Artiste Vérifié' : user.role === 'LABEL' ? 'Label Officiel' : 'Mélomane & Auditeur'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-full bg-[#008A3B] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#008A3B]/30 hover:bg-[#006B2E] hover:scale-105 transition"
            >
              <User className="h-4 w-4" />
              <span>Connexion / Inscription</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
