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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-36">
            <Image
              src="/logo CashPlay Music vert blanc.png"
              alt="CashPlay Music"
              fill
              className="object-contain object-left"
              priority
            />
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
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                <User className="h-3.5 w-3.5 text-[#008A3B]" />
                <span className="font-medium text-white">{user.fullName || 'Mon Compte'}</span>
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
