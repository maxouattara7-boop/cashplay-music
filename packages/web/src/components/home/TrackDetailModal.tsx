'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, Play, Pause, ShoppingBag, Crown, ShieldCheck, Heart, 
  Share2, MessageSquare, Lock, Send, CheckCircle2, Video, Music2, Sparkles, Volume2
} from 'lucide-react';
import { CatalogTrackItem } from './TrackCard';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';

export interface CommentItem {
  id: string;
  authorName: string;
  avatarText: string;
  date: string;
  content: string;
  isVip?: boolean;
}

interface TrackDetailModalProps {
  track: CatalogTrackItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (track: CatalogTrackItem, isVip?: boolean) => void;
  isPurchased?: boolean;
}

const initialMockComments: Record<string, CommentItem[]> = {
  'track-1': [
    {
      id: 'c1',
      authorName: 'Ibrahim Sangaré',
      avatarText: 'IS',
      date: 'Il y a 2h',
      content: 'Floby ne déçoit jamais ! Ce morceau tourne en boucle dans ma voiture à Ouaga. Force à l artiste 🇧🇫🔥',
      isVip: true,
    },
    {
      id: 'c2',
      authorName: 'Aïcha Traoré',
      avatarText: 'AT',
      date: 'Il y a 5h',
      content: 'Achat sans hésitation via Orange Money, la qualité studio est incroyable.',
      isVip: false,
    },
  ],
  default: [
    {
      id: 'cd1',
      authorName: 'Mamadou K.',
      avatarText: 'MK',
      date: 'Hier',
      content: 'Morceau exceptionnel ! Fière de soutenir directement la culture africaine sur CashPlay.',
      isVip: true,
    },
    {
      id: 'cd2',
      authorName: 'Fatimata D.',
      avatarText: 'FD',
      date: 'Il y a 1 jour',
      content: 'Les paroles sont profondes, merci pour cette œuvre magistrale.',
      isVip: false,
    },
  ],
};

export const TrackDetailModal: React.FC<TrackDetailModalProps> = ({
  track,
  isOpen,
  onClose,
  onBuy,
  isPurchased = false,
}) => {
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const { user } = useAuth();

  const [activeMediaTab, setActiveMediaTab] = useState<'cover' | 'teaser'>('cover');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(
    track ? initialMockComments[track.id] || initialMockComments.default : initialMockComments.default
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  if (!isOpen || !track) return null;

  const isCurrentAudioPlaying = isPlaying && currentTrack?.id === track.id;
  const salesCount = track.streamCount || 429;
  const vipPrice = Math.round(track.priceXOF * 2.5);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      authorName: user?.fullName || 'Mélomane CashPlay',
      avatarText: user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'CP',
      date: 'À l instant',
      content: commentText.trim(),
      isVip: user?.role === 'ARTIST',
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Bouton de Fermeture */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/60 p-2 text-gray-300 backdrop-blur-md hover:bg-white/20 hover:text-white transition"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Colonne Gauche : Affiche HD & Teaser Vidéo */}
          <div className="md:col-span-5 bg-zinc-900/60 p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            <div>
              {/* Sélecteur Média Cover / Teaser */}
              <div className="flex items-center gap-2 mb-4 bg-black/40 p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('cover')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeMediaTab === 'cover'
                      ? 'bg-[#008A3B] text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Music2 className="h-3.5 w-3.5" />
                  <span>Pochette HD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('teaser')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeMediaTab === 'teaser'
                      ? 'bg-[#008A3B] text-white shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Video className="h-3.5 w-3.5 text-yellow-400" />
                  <span>Teaser Vidéo</span>
                </button>
              </div>

              {/* Cadre de Visionnage */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black border border-white/10 shadow-2xl group">
                {activeMediaTab === 'cover' ? (
                  <>
                    <Image
                      src={track.coverUrl}
                      alt={track.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Badge Slogan officiel discret */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      <Sparkles className="h-3 w-3 text-[#F59E0B]" />
                      <span className="text-[10px] font-bold text-gray-200">CashPlay Master</span>
                    </div>

                    {/* Écoute de l'extrait rapide */}
                    <button
                      type="button"
                      onClick={() =>
                        playTrack({
                          id: track.id,
                          title: track.title,
                          artistName: track.artistName,
                          coverUrl: track.coverUrl,
                          audioUrl: track.previewUrl,
                          durationSeconds: 30,
                          priceXOF: track.priceXOF,
                          isPreview: true,
                        })
                      }
                      className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-xl bg-[#008A3B]/90 hover:bg-[#008A3B] py-2.5 text-xs font-bold text-white backdrop-blur-sm transition shadow-lg shadow-black/60"
                    >
                      {isCurrentAudioPlaying ? (
                        <>
                          <Pause className="h-4 w-4 fill-current" />
                          <span>Pause Extrait 30s</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 fill-current" />
                          <span>Écouter l Extrait (30s gratuit)</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  /* Lecteur Teaser Vidéo Promo */
                  <div className="relative h-full w-full bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
                    <div className="relative h-20 w-20 rounded-full border-2 border-[#008A3B] bg-zinc-900 flex items-center justify-center mb-3 shadow-lg shadow-[#008A3B]/30 animate-pulse">
                      <Video className="h-8 w-8 text-[#008A3B]" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Clip Promo & Teaser Exclusif
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1 max-w-[200px]">
                      Aperçu vidéo officiel préparé par {track.artistName} pour les mélomanes CashPlay
                    </p>
                    <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] text-[#008A3B] border border-[#008A3B]/30">
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Audio HD Stéréo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques et Partage */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1.5 text-[#008A3B] font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>{salesCount} Ventes Certifiées</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHasLiked(!hasLiked)}
                  className={`p-2 rounded-lg bg-white/5 transition ${
                    hasLiked ? 'text-red-500 bg-red-500/10' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Aimer"
                >
                  <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white transition relative"
                  title="Partager"
                >
                  <Share2 className="h-4 w-4" />
                  {copiedLink && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#008A3B] text-[9px] text-white px-2 py-0.5 rounded shadow">
                      Copié!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Infos, Options d'Achat & Commentaires Réservés */}
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-5">
            <div>
              {/* En-tête Titre & Auteur */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#008A3B]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#008A3B] border border-[#008A3B]/30 uppercase">
                      {track.genre}
                    </span>
                    <span className="text-[11px] text-gray-400">Sortie Officielle CashPlay</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 leading-snug">
                    {track.title}
                  </h2>
                  <p className="text-sm font-semibold text-gray-300 mt-0.5">
                    Par <span className="text-white hover:underline cursor-pointer">{track.artistName}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-[#008A3B]">
                    {track.priceXOF.toLocaleString('fr-FR')} F
                  </div>
                  <span className="text-[10px] text-gray-400">CFA UEMOA</span>
                </div>
              </div>

              {/* Modèle économique & Répartition */}
              <div className="mt-3.5 rounded-xl bg-white/5 p-2.5 border border-white/5 text-[11px] text-gray-300 flex items-center justify-between">
                <span>Direct Créateur : <strong>80% reversé à l artiste</strong></span>
                <span className="text-yellow-400 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  SasPay Sécurisé
                </span>
              </div>

              {/* Boutons d'Achat : Normal & VIP */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Achat Standard */}
                <button
                  type="button"
                  onClick={() => onBuy(track, false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#008A3B] py-3 px-4 text-xs font-black text-white shadow-lg shadow-[#008A3B]/25 hover:bg-[#006B2E] transition active:scale-[0.98]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Acheter ({track.priceXOF} F CFA)</span>
                </button>

                {/* Achat VIP / Supporter d'Or */}
                <button
                  type="button"
                  onClick={() => onBuy(track, true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 py-3 px-4 text-xs font-black text-white shadow-lg shadow-yellow-500/20 hover:from-amber-600 hover:to-yellow-700 transition active:scale-[0.98]"
                >
                  <Crown className="h-4 w-4 text-yellow-200" />
                  <span>Achat VIP 👑 ({vipPrice} F)</span>
                </button>
              </div>

              {/* Section Commentaires Acheteurs Certifiés */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[#008A3B]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Commentaires Acheteurs ({comments.length})
                    </h3>
                  </div>
                  <span className="text-[10px] text-gray-400">Avis certifiés vérifiés</span>
                </div>

                {/* Condition : L'utilisateur a-t-il acheté le titre ? */}
                {isPurchased ? (
                  /* Formulaire de commentaire actif pour acheteur */
                  <form onSubmit={handlePostComment} className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Laissez votre avis d acheteur vérifié..."
                        className="w-full rounded-xl bg-white/10 py-2.5 pl-3.5 pr-11 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008A3B]"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#008A3B] text-white hover:bg-[#006B2E] transition"
                        title="Publier"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Encart exclusif réservé aux acheteurs */
                  <div className="mb-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 flex items-start gap-2.5">
                    <Lock className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-[11px] text-gray-300 leading-relaxed">
                      <span className="font-bold text-yellow-400">Espace Acheteurs Vérifiés :</span> Seuls les
                      fans ayant acheté cette chanson ont le droit d échanger et de commenter avec l artiste.
                      <span className="block text-[10px] text-gray-400 mt-0.5">
                        Achetez le titre pour débloquer immédiatement la parole.
                      </span>
                    </div>
                  </div>
                )}

                {/* Liste des Commentaires */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {comments.map((comm) => (
                    <div
                      key={comm.id}
                      className="rounded-xl bg-white/5 p-2.5 border border-white/5 hover:border-white/10 transition"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#008A3B] text-[9px] font-bold text-white">
                            {comm.avatarText}
                          </div>
                          <span className="font-semibold text-white">{comm.authorName}</span>
                          <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Acheteur Vérifié
                          </span>
                          {comm.isVip && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-500/20">
                              <Crown className="h-2.5 w-2.5" />
                              VIP
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500">{comm.date}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-300 pl-7 leading-relaxed">{comm.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pied de page du modal */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-500">
              <span>Paiement mobile instantané Orange Money, Moov, Wave, Carte</span>
              <span>Propulsé par SasPay UEMOA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
