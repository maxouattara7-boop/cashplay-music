'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/navigation/Navbar';
import { DistributionExportModal } from '../../components/admin/DistributionExportModal';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Music,
  Users,
  Globe,
  CheckCircle,
  XCircle,
  Download,
  Sparkles,
  Smartphone,
  Eye,
} from 'lucide-react';

const mockReleasesPending = [
  {
    id: 'rel-1',
    title: 'Burkina Faso N°1',
    artistName: 'Amzy feat. Kayawoto',
    type: 'SINGLE',
    genre: 'Afro-Rap',
    feePaid: 2600, // 2000 F + 30% option globale
    isGlobalDistribution: true,
    isPreOrder: true,
    preOrderDays: 6,
    submittedAt: '12 Nov 2026',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'rel-2',
    title: 'Yam Wêmdé',
    artistName: 'Smarty',
    type: 'ALBUM',
    genre: 'Hip-Hop Africain',
    feePaid: 9100, // 7000 F + 30% option globale
    isGlobalDistribution: true,
    isPreOrder: true,
    preOrderDays: 11,
    submittedAt: '11 Nov 2026',
    status: 'APPROVED',
  },
  {
    id: 'rel-3',
    title: 'Dounia',
    artistName: 'Floby',
    type: 'SINGLE',
    genre: 'Afropop',
    feePaid: 2000,
    isGlobalDistribution: false,
    isPreOrder: false,
    submittedAt: '09 Nov 2026',
    status: 'LIVE_CASHPAY',
  },
];

const mockPayouts = [
  {
    id: 'payout-1',
    creatorName: 'Amzy (Artiste)',
    amountXOF: 25000,
    paymentMethod: 'ORANGE_MONEY',
    phoneNumber: '+226 70 12 34 56',
    date: '12 Nov 2026',
    status: 'PENDING',
  },
  {
    id: 'payout-2',
    creatorName: 'Destiny Prod (Label)',
    amountXOF: 80000,
    paymentMethod: 'WAVE',
    phoneNumber: '+226 76 98 76 54',
    date: '12 Nov 2026',
    status: 'PENDING',
  },
  {
    id: 'payout-3',
    creatorName: 'Floby (Artiste)',
    amountXOF: 15000,
    paymentMethod: 'MOOV_MONEY',
    phoneNumber: '+226 60 11 22 33',
    date: '10 Nov 2026',
    status: 'PAID',
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'releases' | 'payouts' | 'ads'>('releases');
  const [selectedExportRelease, setSelectedExportRelease] = useState<any | null>(null);

  const [payoutsList, setPayoutsList] = useState(mockPayouts);

  const handleApprovePayout = (id: string) => {
    setPayoutsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'PAID' } : p))
    );
  };

  const handleRejectPayout = (id: string) => {
    setPayoutsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'REJECTED' } : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-white pb-24">
      <Navbar user={user} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à l accueil</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <h1 className="text-2xl font-black text-white">Back-Office Administrateur</h1>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Supervision de la plateforme, modération du catalogue, retraits Mobile Money et exports vers les +150 DSPs.
            </p>
          </div>
        </div>

        {/* KPIs Financiers & Supervision Globale */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl bg-zinc-900/90 p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Volume des Ventes</span>
              <DollarSign className="h-4 w-4 text-[#008A3B]" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">1 240 000 F</div>
            <span className="text-[10px] text-gray-400 mt-1 block">Ventes directes & distributions</span>
          </div>

          <div className="rounded-xl bg-zinc-900/90 p-4 border border-[#008A3B]/40 bg-[#008A3B]/5">
            <div className="flex items-center justify-between text-xs text-[#008A3B]">
              <span className="font-bold">Marge CashPlay (20%)</span>
              <TrendingUp className="h-4 w-4 text-[#008A3B]" />
            </div>
            <div className="mt-2 text-2xl font-black text-[#008A3B]">248 000 F CFA</div>
            <span className="text-[10px] text-gray-400 mt-1 block">Commission nette plateforme</span>
          </div>

          <div className="rounded-xl bg-zinc-900/90 p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Reversé Artistes (80%)</span>
              <Music className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">992 000 F CFA</div>
            <span className="text-[10px] text-gray-400 mt-1 block">Droits et parts labels</span>
          </div>

          <div className="rounded-xl bg-zinc-900/90 p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Communauté</span>
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">1 420</div>
            <span className="text-[10px] text-gray-400 mt-1 block">180 Artistes • 14 Labels</span>
          </div>
        </div>

        {/* Onglets de Gestion */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-6 max-w-md">
          <button
            onClick={() => setActiveTab('releases')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === 'releases' ? 'bg-[#008A3B] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Modération & Distribution
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              activeTab === 'payouts' ? 'bg-[#008A3B] text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Retraits Mobile Money
          </button>
        </div>

        {/* Section 1 : Modération & Distribution Globale */}
        {activeTab === 'releases' && (
          <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-white">Projets Téléversés & Distribution Globale</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Validation des métadonnées, audio master et export vers les +150 plateformes de streaming légal (délai 14 jours).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/5 text-gray-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Œuvre & Artiste</th>
                    <th className="p-3.5">Format</th>
                    <th className="p-3.5">Frais Réglés</th>
                    <th className="p-3.5">Options</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Actions Distribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockReleasesPending.map((rel) => (
                    <tr key={rel.id} className="hover:bg-white/5 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{rel.title}</div>
                        <div className="text-xs text-[#008A3B]">{rel.artistName} • {rel.genre}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-gray-300">{rel.type}</td>
                      <td className="p-3.5 font-mono text-white">{rel.feePaid} F CFA</td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {rel.isGlobalDistribution && (
                            <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/30">
                              +150 DSPs (+30%)
                            </span>
                          )}
                          {rel.isPreOrder && (
                            <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-400 border border-yellow-500/30">
                              Prévente J-{rel.preOrderDays}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-[10px] font-bold text-green-400 border border-green-500/30">
                          {rel.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {rel.isGlobalDistribution ? (
                          <button
                            onClick={() => setSelectedExportRelease(rel)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#008A3B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#006B2E] transition shadow"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span>Exporter pour 150+ DSPs</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-500">Exclusivité CashPlay</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Section 2 : Retraits Mobile Money */}
        {activeTab === 'payouts' && (
          <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-white">Demandes de Retraits Mobile Money</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Validation des versements vers Orange Money, Moov Money et Wave (Seuil minimal vérifié : 500 F CFA).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/5 text-gray-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Bénéficiaire</th>
                    <th className="p-3.5">Montant Net</th>
                    <th className="p-3.5">Opérateur & Numéro</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Validation SasPay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payoutsList.map((payout) => (
                    <tr key={payout.id} className="hover:bg-white/5 transition">
                      <td className="p-3.5 font-bold text-white">{payout.creatorName}</td>
                      <td className="p-3.5 font-black text-[#008A3B] text-sm">{payout.amountXOF} F CFA</td>
                      <td className="p-3.5 font-mono text-gray-300">
                        {payout.paymentMethod} • {payout.phoneNumber}
                      </td>
                      <td className="p-3.5 text-gray-400">{payout.date}</td>
                      <td className="p-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            payout.status === 'PAID'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : payout.status === 'REJECTED'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {payout.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprovePayout(payout.id)}
                              className="rounded-lg bg-[#008A3B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#006B2E] transition"
                            >
                              Valider Virement
                            </button>
                            <button
                              onClick={() => handleRejectPayout(payout.id)}
                              className="rounded-lg bg-red-500/20 text-red-400 px-2.5 py-1.5 text-xs font-bold hover:bg-red-500/30 transition"
                            >
                              Rejeter
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-500">Traité</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Modale d'Export DDEX vers les +150 DSPs */}
      <DistributionExportModal
        release={selectedExportRelease}
        onClose={() => setSelectedExportRelease(null)}
      />
    </div>
  );
}
