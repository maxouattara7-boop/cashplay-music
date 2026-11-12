'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, CheckCircle, CreditCard, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface PurchaseTarget {
  id: string;
  title: string;
  artistName: string;
  coverUrl: string;
  priceXOF: number;
  isPreOrder?: boolean;
}

interface PurchaseModalProps {
  target: PurchaseTarget | null;
  onClose: () => void;
  onSuccess: (target: PurchaseTarget) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ target, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'ORANGE_MONEY' | 'MOOV_MONEY' | 'WAVE' | 'CARD'>('ORANGE_MONEY');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!target) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    try {
      const token = user?.token || localStorage.getItem('cashplay_token');
      if (!token) {
        throw new Error('Veuillez vous connecter pour effectuer un achat');
      }

      const res = await fetch(`${apiUrl}/api/v1/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trackId: target.id,
          paymentMethod,
          customerPhone: phoneNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l initiation du paiement');

      // Simulation de validation webhook SasPay en mode test / démo
      await fetch(`${apiUrl}/api/v1/payments/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderId,
          status: 'SUCCESS',
          signature: 'valid_dev_signature_saspay',
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess(target);
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#008A3B]/40 bg-zinc-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="flex flex-col items-center py-6 text-center animate-fadeIn">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#008A3B]/20 text-[#008A3B] mb-3">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Paiement Réussi !</h3>
            <p className="mt-2 text-xs text-gray-300 max-w-xs">
              {target.isPreOrder
                ? `Votre précommande pour « ${target.title} » est enregistrée ! Le son sera débloqué le jour de la sortie.`
                : `Le morceau « ${target.title} » a été ajouté à votre bibliothèque « Mes Sons » pour une écoute illimitée.`}
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-black text-white">
              {target.isPreOrder ? 'Précommander le Titre' : 'Acheter le Morceau'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Paiement sécurisé via passerelle SasPay</p>

            {/* Récapitulatif Titre */}
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-800">
                <Image src={target.coverUrl} alt={target.title} fill className="object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="truncate text-sm font-bold text-white">{target.title}</h4>
                <p className="truncate text-xs text-gray-400">{target.artistName}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-[#008A3B]">{target.priceXOF} F CFA</span>
              </div>
            </div>

            {error && (
              <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Choix Méthode de Paiement Mobile Money */}
            <form onSubmit={handlePay} className="mt-5 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Moyen de paiement :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ORANGE_MONEY', name: 'Orange Money', color: 'border-orange-500/50' },
                    { id: 'MOOV_MONEY', name: 'Moov Money', color: 'border-blue-500/50' },
                    { id: 'WAVE', name: 'Wave', color: 'border-cyan-400/50' },
                    { id: 'CARD', name: 'Carte Bancaire', color: 'border-white/20' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold border transition ${
                        paymentMethod === method.id
                          ? 'border-[#008A3B] bg-[#008A3B]/20 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <CreditCard className="h-4 w-4 text-[#008A3B]" />
                      <span>{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod !== 'CARD' && (
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Numéro de téléphone Mobile Money
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+226 70 XX XX XX"
                    className="w-full rounded-xl bg-white/10 py-2.5 px-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Vous recevrez une invite USSD / push sur votre téléphone pour valider votre code secret.
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="h-4 w-4 text-[#008A3B]" />
                <span>80% du montant est directement reversé à l'artiste.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008A3B] py-3 text-xs font-bold text-white shadow-lg shadow-[#008A3B]/30 hover:bg-[#006B2E] transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Traitement SasPay...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmer et Payer {target.priceXOF} F CFA</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
