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

        {/* Logo & Slogan */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative h-14 w-14 mb-2 overflow-hidden rounded-2xl border border-[#008A3B]/40 bg-white p-1 shadow-md shadow-[#008A3B]/20">
            <Image
              src="/cashplay-logo.jpg"
              alt="CashPlay Music"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-base font-black text-white">CashPlay <span className="text-[#008A3B]">MUSIC</span></h3>
          <p className="text-xs text-gray-300 font-medium mt-0.5">La musique prend de la valeur.</p>
        </div>

        {/* Bouton Google Officiel */}
        <button
          type="button"
          onClick={() => {
            // Connexion rapide Google
            login('demo_google_token', {
              id: 'google-user-1',
              fullName: 'Maxime Ouattara',
              email: 'maxime.ouattara@gmail.com',
              role: role,
            });
            onClose();
          }}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-2.5 px-4 text-xs font-bold text-gray-800 shadow hover:bg-gray-50 transition hover:scale-[1.01]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continuer avec Google</span>
        </button>

        {/* Séparateur */}
        <div className="relative flex items-center justify-center my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-zinc-950 px-3 text-[10px] uppercase font-semibold text-gray-500">
            ou avec vos identifiants
          </span>
        </div>

        {/* Onglets Connexion / Inscription */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-4">
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
