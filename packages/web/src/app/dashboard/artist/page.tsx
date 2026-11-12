'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/navigation/Navbar';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Plus, DollarSign, Music, TrendingUp, CheckCircle, Smartphone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function ArtistDashboard() {
  const { user } = useAuth();

  const [distributeModalOpen, setDistributeModalOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);

  // Formulaire Distribution
  const [releaseTitle, setReleaseTitle] = useState('');
  const [releaseType, setReleaseType] = useState<'SINGLE' | 'EP' | 'ALBUM'>('SINGLE');
  const [isGlobal, setIsGlobal] = useState(false);
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [distributionSuccess, setDistributionSuccess] = useState(false);

  // Formulaire Retrait
  const [payoutAmount, setPayoutAmount] = useState('2000');
  const [payoutPhone, setPayoutPhone] = useState(user?.phone || '+226 70 00 00 01');
  const [payoutMethod, setPayoutMethod] = useState('ORANGE_MONEY');
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Calcul du tarif
  const basePrice = releaseType === 'SINGLE' ? 2000 : releaseType === 'EP' ? 5000 : 7000;
  const totalPrice = isGlobal ? Math.round(basePrice * 1.3) : basePrice;

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-white pb-24">
      <Navbar user={user} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à l accueil</span>
        </Link>

        {/* En-tête profil artiste */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-black p-6 border border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user?.fullName || 'Artiste CashPlay'}</h1>
              <span className="rounded-full bg-[#008A3B]/20 px-2.5 py-0.5 text-xs font-bold text-[#008A3B] border border-[#008A3B]/30">
                Profil Vérifié
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Plateforme autonome de distribution et vente directe • Rémunération équitable (80% créateur)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDistributeModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#008A3B] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#008A3B]/30 hover:bg-[#006B2E] transition"
            >
              <Plus className="h-4 w-4" />
              <span>Distribuer un projet</span>
            </button>
          </div>
        </div>

        {/* Statistiques Financières & Écoutes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="rounded-xl bg-zinc-900/90 p-5 border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Solde Retirable (80% net)</span>
              <DollarSign className="h-4 w-4 text-[#008A3B]" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">48 500 F CFA</div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Seuil min : 500 F CFA</span>
              <button
                onClick={() => setPayoutModalOpen(true)}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-[#008A3B] transition"
              >
                Demander Retrait
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-900/90 p-5 border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Total Ventes Directes</span>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">182 Titres</div>
            <p className="mt-4 text-[11px] text-gray-400">Paiements via Orange Money & Wave</p>
          </div>

          <div className="rounded-xl bg-zinc-900/90 p-5 border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Écoutes Totales (Streams)</span>
              <Music className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">14 250</div>
            <p className="mt-4 text-[11px] text-gray-400">Lecteur Web & Application Mobile</p>
          </div>
        </div>

        {/* Mes Titres & Projets */}
        <section className="mt-10">
          <h3 className="text-lg font-bold text-white mb-4">Mes Titres Distribués</h3>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 text-gray-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Titre</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Prix Unitaire</th>
                  <th className="p-3.5">Ventes</th>
                  <th className="p-3.5">Revenus nets (80%)</th>
                  <th className="p-3.5">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/5 transition">
                  <td className="p-3.5 font-bold text-white">Burkina Faso N°1</td>
                  <td className="p-3.5">
                    <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-400 border border-yellow-500/30">
                      Prévente J-6
                    </span>
                  </td>
                  <td className="p-3.5">500 F</td>
                  <td className="p-3.5">64</td>
                  <td className="p-3.5 font-bold text-[#008A3B]">25 600 F</td>
                  <td className="p-3.5 text-green-400">Actif</td>
                </tr>
                <tr className="hover:bg-white/5 transition">
                  <td className="p-3.5 font-bold text-white">Dounia</td>
                  <td className="p-3.5">Single</td>
                  <td className="p-3.5">200 F</td>
                  <td className="p-3.5">118</td>
                  <td className="p-3.5 font-bold text-[#008A3B]">18 880 F</td>
                  <td className="p-3.5 text-green-400">Distribué (+150 DSPs)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal Distribution de Titre */}
      {distributeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="text-lg font-black text-white">Distribuer un Nouveau Projet</h3>
            <p className="text-xs text-gray-400 mt-1">Facturation unitaire sans abonnement annuel obligatoire</p>

            {distributionSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-[#008A3B] mb-2" />
                <h4 className="text-base font-bold text-white">Projet soumis avec succès !</h4>
                <p className="text-xs text-gray-400 mt-1">Le titre a été mis en ligne et sera disponible après validation technique.</p>
                <button
                  onClick={() => {
                    setDistributionSuccess(false);
                    setDistributeModalOpen(false);
                  }}
                  className="mt-4 rounded-xl bg-[#008A3B] px-5 py-2 text-xs font-bold text-white"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Titre de l'œuvre</label>
                  <input
                    type="text"
                    value={releaseTitle}
                    onChange={(e) => setReleaseTitle(e.target.value)}
                    placeholder="Ex: Hymne de la Victoire"
                    className="w-full rounded-xl bg-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Format de publication</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'SINGLE', name: 'Single (1 titre)', price: '2 000 F' },
                      { key: 'EP', name: 'EP (2-6 titres)', price: '5 000 F' },
                      { key: 'ALBUM', name: 'Album (+6 titres)', price: '7 000 F' },
                    ].map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setReleaseType(f.key as any)}
                        className={`rounded-xl p-2.5 text-center border transition ${
                          releaseType === f.key
                            ? 'border-[#008A3B] bg-[#008A3B]/20 text-white'
                            : 'border-white/10 bg-white/5 text-gray-400'
                        }`}
                      >
                        <div className="text-xs font-bold">{f.name}</div>
                        <div className="text-[11px] text-[#008A3B] mt-0.5">{f.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option Prévente J-14 */}
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPreOrder}
                      onChange={(e) => setIsPreOrder(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded accent-yellow-400"
                    />
                    <div>
                      <span className="text-xs font-bold text-yellow-300 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Mettre en prévente exclusive (J-14 à J-7)
                      </span>
                      <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                        Commercialisez votre titre 1 à 2 semaines avant sa sortie officielle pour mobiliser votre communauté et générer des ventes anticipées.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Option Distribution Globale +30% */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGlobal}
                      onChange={(e) => setIsGlobal(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded accent-[#008A3B]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white">
                        Distribution globale (+150 plateformes de streaming légal)
                      </span>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Diffusion sur Spotify, Apple Music, Deezer sous 14 jours. Supplément automatique de <strong>+30%</strong>.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Total & Paiement */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Frais de distribution totaux</span>
                    <span className="text-lg font-black text-[#008A3B]">{totalPrice} F CFA</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDistributeModalOpen(false)}
                      className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={() => setDistributionSuccess(true)}
                      className="rounded-xl bg-[#008A3B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#006B2E] transition shadow-lg shadow-[#008A3B]/30"
                    >
                      Payer par Mobile Money
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Retrait Mobile Money (seuil 500 F) */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="text-lg font-black text-white">Demande de Retrait Mobile Money</h3>
            <p className="text-xs text-gray-400 mt-1">Seuil minimal : <strong>500 F CFA</strong> (hors taxes et commissions)</p>

            {payoutSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-[#008A3B] mb-2" />
                <h4 className="text-base font-bold text-white">Retrait envoyé !</h4>
                <p className="text-xs text-gray-400 mt-1">Les fonds seront crédités directement sur votre compte Mobile Money après validation.</p>
                <button
                  onClick={() => {
                    setPayoutSuccess(false);
                    setPayoutModalOpen(false);
                  }}
                  className="mt-4 rounded-xl bg-[#008A3B] px-5 py-2 text-xs font-bold text-white"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Montant à retirer (FCFA)</label>
                  <input
                    type="number"
                    min={500}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full rounded-xl bg-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Moyen de réception</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['ORANGE_MONEY', 'MOOV_MONEY', 'WAVE'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPayoutMethod(m)}
                        className={`rounded-xl py-2 text-[11px] font-bold border transition ${
                          payoutMethod === m
                            ? 'border-[#008A3B] bg-[#008A3B]/20 text-white'
                            : 'border-white/10 bg-white/5 text-gray-400'
                        }`}
                      >
                        {m.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Numéro Mobile Money</label>
                  <input
                    type="tel"
                    value={payoutPhone}
                    onChange={(e) => setPayoutPhone(e.target.value)}
                    className="w-full rounded-xl bg-white/10 py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPayoutModalOpen(false)}
                    className="flex-1 rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutSuccess(true)}
                    className="flex-1 rounded-xl bg-[#008A3B] py-2.5 text-xs font-bold text-white hover:bg-[#006B2E] transition shadow-lg shadow-[#008A3B]/30"
                  >
                    Valider le Retrait
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
