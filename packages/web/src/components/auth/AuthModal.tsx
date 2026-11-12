'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, User, Lock, Mail, Phone, Tag, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [role, setRole] = useState<'AUDITOR' | 'ARTIST' | 'LABEL'>('AUDITOR');

  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [stageName, setStageName] = useState('');
  const [labelName, setLabelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    try {
      if (tab === 'register') {
        const isEmail = identifier.includes('@');
        const res = await fetch(`${apiUrl}/api/v1/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            email: isEmail ? identifier : undefined,
            phone: !isEmail ? identifier : undefined,
            password,
            role,
            stageName: role === 'ARTIST' ? stageName || fullName : undefined,
            labelName: role === 'LABEL' ? labelName || fullName : undefined,
            referralCode: referralCode || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur lors de l inscription');

        login(data.token, data.user);
        onClose();
      } else {
        const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Identifiants invalides');

        login(data.token, data.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative h-12 w-36 mb-2">
            <Image
              src="/logo CashPlay Music vert blanc.png"
              alt="CashPlay Music"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xs text-gray-400 font-medium">« La musique prend de la valeur. »</p>
        </div>

        {/* Onglets Connexion / Inscription */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              tab === 'login' ? 'bg-[#008A3B] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Se Connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              tab === 'register' ? 'bg-[#008A3B] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Créer un Compte
          </button>
        </div>

        {/* Sélecteur de Rôle (Inscription) */}
        {tab === 'register' && (
          <div className="mb-4">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Je m inscris en tant que :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'AUDITOR', label: 'Auditeur' },
                { key: 'ARTIST', label: 'Artiste' },
                { key: 'LABEL', label: 'Label' },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key as any)}
                  className={`rounded-lg py-2 text-xs font-bold border transition ${
                    role === r.key
                      ? 'border-[#008A3B] bg-[#008A3B]/20 text-[#008A3B]'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Ibrahim Ouédraogo"
                  className="w-full rounded-xl bg-white/10 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
                />
              </div>
            </div>
          )}

          {tab === 'register' && role === 'ARTIST' && (
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Nom de Scène</label>
              <input
                type="text"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="Ex: Smarty, Amzy..."
                className="w-full rounded-xl bg-white/10 py-2.5 px-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
              />
            </div>
          )}

          {tab === 'register' && role === 'LABEL' && (
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Nom du Label</label>
              <input
                type="text"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                placeholder="Ex: Destiny Prod, Hope Music..."
                className="w-full rounded-xl bg-white/10 py-2.5 px-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Numéro de téléphone ou Email
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+226 70 XX XX XX ou email@domaine.com"
                className="w-full rounded-xl bg-white/10 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-white/10 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Code de parrainage (Optionnel)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Code de votre parrain"
                  className="w-full rounded-xl bg-white/10 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#008A3B] py-3 text-xs font-bold text-white shadow-lg shadow-[#008A3B]/30 hover:bg-[#006B2E] transition disabled:opacity-50"
          >
            <span>{loading ? 'Chargement...' : tab === 'login' ? 'Connexion' : 'Valider mon inscription'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
