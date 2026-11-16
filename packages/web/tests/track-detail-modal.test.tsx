import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrackDetailModal } from '../src/components/home/TrackDetailModal';
import { AudioProvider } from '../src/context/AudioContext';
import { AuthProvider } from '../src/context/AuthContext';

const mockTrack = {
  id: 'track-test-1',
  title: 'Dounia Révolution',
  artistName: 'Floby',
  coverUrl: '/cashplay-logo.jpg',
  genre: 'Afropop',
  priceXOF: 2000,
  previewUrl: 'https://example.com/audio.mp3',
  streamCount: 429,
};

describe('Composant TrackDetailModal (Fiche Titre Web)', () => {
  it('doit afficher les informations du morceau, le prix et les boutons d achat standard et VIP', () => {
    render(
      <AuthProvider>
        <AudioProvider>
          <TrackDetailModal
            track={mockTrack}
            isOpen={true}
            onClose={() => {}}
            onBuy={() => {}}
            isPurchased={false}
          />
        </AudioProvider>
      </AuthProvider>
    );

    expect(screen.getByText('Dounia Révolution')).toBeDefined();
    expect(screen.getByText(/Floby/)).toBeDefined();
    expect(screen.getByText(/2 000 F/)).toBeDefined();
    expect(screen.getByText(/Acheter \(2000 F CFA\)/)).toBeDefined();
    expect(screen.getByText(/Achat VIP 👑/)).toBeDefined();
  });

  it('doit verrouiller les commentaires si l auditeur n a pas acheté le morceau', () => {
    render(
      <AuthProvider>
        <AudioProvider>
          <TrackDetailModal
            track={mockTrack}
            isOpen={true}
            onClose={() => {}}
            onBuy={() => {}}
            isPurchased={false}
          />
        </AudioProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/Espace Acheteurs Vérifiés :/)).toBeDefined();
    expect(screen.getByText(/Seuls les fans ayant acheté cette chanson ont le droit d échanger/)).toBeDefined();
  });

  it('doit débloquer le champ de commentaire si l auditeur a acheté le morceau', () => {
    render(
      <AuthProvider>
        <AudioProvider>
          <TrackDetailModal
            track={mockTrack}
            isOpen={true}
            onClose={() => {}}
            onBuy={() => {}}
            isPurchased={true}
          />
        </AudioProvider>
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText(/Laissez votre avis d acheteur vérifié/)).toBeDefined();
  });
});
