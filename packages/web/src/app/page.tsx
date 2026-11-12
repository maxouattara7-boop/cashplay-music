'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { HeroBanner } from '../components/home/HeroBanner';
import { PreOrderSection, PreOrderItem } from '../components/home/PreOrderSection';
import { TrackCard, CatalogTrackItem } from '../components/home/TrackCard';
import { AudioPlayer } from '../components/player/AudioPlayer';
import { ConversionPopup } from '../components/auth/ConversionPopup';
import { AuthModal } from '../components/auth/AuthModal';
import { PurchaseModal, PurchaseTarget } from '../components/payments/PurchaseModal';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';
import { Flame, Music, Sparkles } from 'lucide-react';

const mockPreOrders: PreOrderItem[] = [
  {
    id: 'pre-1',
    title: 'Burkina Faso N°1',
    artistName: 'Amzy feat. Kayawoto',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    genre: 'Afro-Rap',
    priceXOF: 500,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    daysRemaining: 6,
    officialDateFormatted: '18 Nov 2026',
  },
  {
    id: 'pre-2',
    title: 'Yam Wêmdé (Nouvel Album)',
    artistName: 'Smarty',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    genre: 'Hip-Hop Africain',
    priceXOF: 1000,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    daysRemaining: 11,
    officialDateFormatted: '23 Nov 2026',
  },
  {
    id: 'pre-3',
    title: 'Kuma (Parole Sacrée)',
    artistName: 'Fatoumata Diawara',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    genre: 'Musique Mandingue',
    priceXOF: 300,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    daysRemaining: 4,
    officialDateFormatted: '16 Nov 2026',
  },
];

const mockCatalog: CatalogTrackItem[] = [
  {
    id: 'track-1',
    title: 'Dounia',
    artistName: 'Floby',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    genre: 'Afropop',
    priceXOF: 200,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 'track-2',
    title: 'M bi fê',
    artistName: 'Sidiki Diabaté',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    genre: 'Kora & Afrobeats',
    priceXOF: 300,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: 'track-3',
    title: 'Révolution Culturelle',
    artistName: 'Tiken Jah Fakoly',
    coverUrl: 'https://images.unsplash.com/photo-1445985543469-433ecdd62572?w=600&auto=format&fit=crop&q=80',
    genre: 'Reggae',
    priceXOF: 250,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
  {
    id: 'track-4',
    title: 'Espoir d Afrique',
    artistName: 'Alif Naaba',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    genre: 'Folk Sahélien',
    priceXOF: 200,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  },
];

const genresList = ['Tous', 'Afrobeats', 'Afro-Rap', 'Mandingue', 'Reggae', 'Gospel', 'Traditionnel'];

export default function HomePage() {
  const { user } = useAuth();
  const { show30SecConversionModal, close30SecModal } = useAudio();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [purchaseTarget, setPurchaseTarget] = useState<PurchaseTarget | null>(null);
  const [selectedGenre, setSelectedGenre] = useState('Tous');

  const filteredCatalog = selectedGenre === 'Tous'
    ? mockCatalog
    : mockCatalog.filter((t) => t.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-white pb-32">
      {/* Navigation */}
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} user={user} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* Hero Section */}
        <HeroBanner
          onExploreClick={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onDistributeClick={() => setAuthModalOpen(true)}
        />

        {/* Section Préventes J-14 à J-7 */}
        <PreOrderSection
          items={mockPreOrders}
          onPreOrderClick={(item) =>
            setPurchaseTarget({
              id: item.id,
              title: item.title,
              artistName: item.artistName,
              coverUrl: item.coverUrl,
              priceXOF: item.priceXOF,
              isPreOrder: true,
            })
          }
        />

        {/* Catalogue & Nouveautés */}
        <section id="catalog-section" className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-[#008A3B]" />
                <h2 className="text-xl sm:text-2xl font-black text-white">Nouveautés & Top Ventes</h2>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Écoutez les extraits de 30 secondes et achetez par Mobile Money pour soutenir les artistes
              </p>
            </div>

            {/* Filtres par genre */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {genresList.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                    selectedGenre === genre
                      ? 'bg-[#008A3B] text-white shadow-md'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {filteredCatalog.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onBuyClick={(t) =>
                  setPurchaseTarget({
                    id: t.id,
                    title: t.title,
                    artistName: t.artistName,
                    coverUrl: t.coverUrl,
                    priceXOF: t.priceXOF,
                  })
                }
              />
            ))}
          </div>
        </section>
      </main>

      {/* Lecteur Audio Persistant en bas d'écran */}
      <AudioPlayer
        onBuyTrack={(trackId) => {
          const found = mockCatalog.find((t) => t.id === trackId);
          if (found) {
            setPurchaseTarget({
              id: found.id,
              title: found.title,
              artistName: found.artistName,
              coverUrl: found.coverUrl,
              priceXOF: found.priceXOF,
            });
          }
        }}
      />

      {/* Popup de conversion déclenché à 30 secondes d'écoute anonyme */}
      <ConversionPopup
        isOpen={show30SecConversionModal && !user}
        onClose={close30SecModal}
        onOpenRegister={() => setAuthModalOpen(true)}
      />

      {/* Modale d'Authentification / Inscription */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Modale d'Achat Mobile Money SasPay */}
      <PurchaseModal
        target={purchaseTarget}
        onClose={() => setPurchaseTarget(null)}
        onSuccess={(t) => {
          console.log('Achat confirmé pour :', t.title);
        }}
      />
    </div>
  );
}
