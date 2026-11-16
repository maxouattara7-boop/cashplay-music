import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { CashPlayColors } from '../theme/colors';
import { mobileAudio, AudioTrack } from '../services/audioManager.service';

interface MiniPlayerProps {
  onPress?: () => void;
  onNavigateToLibrary?: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress, onNavigateToLibrary }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(mobileAudio.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState<boolean>(mobileAudio.isPlaying());

  // Mise à jour de l'état toutes les 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrack(mobileAudio.getCurrentTrack());
      setIsPlaying(mobileAudio.isPlaying());
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Démo fallback si aucun morceau n'a encore été lancé
  const track = currentTrack || {
    id: 'demo-1',
    title: 'Démo CashPlay Music',
    artistName: 'Moms Loup • 15.01',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    durationSeconds: 30,
    isPreview: true,
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      mobileAudio.pause();
      setIsPlaying(false);
    } else {
      if (!currentTrack) {
        mobileAudio.loadTrack(track);
      }
      mobileAudio.play();
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        style={styles.capsule}
        activeOpacity={0.9}
        onPress={onNavigateToLibrary || onPress}
      >
        {/* Disque Vinyle / Vignette gauche style Empire */}
        <View style={styles.vinylContainer}>
          <Image
            source={{ uri: track.coverUrl }}
            style={styles.vinylImage}
          />
          <View style={styles.vinylCenterHole} />
        </View>

        {/* Détails du morceau */}
        <View style={styles.infoContainer}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {track.artistName} {track.isPreview ? '• Démo 30s' : ''}
          </Text>
        </View>

        {/* Commandes audio : Précédent, Play/Pause, Suivant (comme Empire) */}
        <View style={styles.controlsRow}>
          {/* Précédent */}
          <TouchableOpacity
            style={styles.navControlBtn}
            onPress={() => mobileAudio.seek(0)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.navIcon}>⏮</Text>
          </TouchableOpacity>

          {/* Play / Pause Principal */}
          <TouchableOpacity
            style={styles.mainPlayBtn}
            onPress={handleTogglePlay}
            activeOpacity={0.8}
          >
            <Text style={styles.mainPlayIcon}>
              {isPlaying ? '❚❚' : '▶'}
            </Text>
          </TouchableOpacity>

          {/* Suivant */}
          <TouchableOpacity
            style={styles.navControlBtn}
            onPress={() => mobileAudio.seek(0)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.navIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 58,
    left: 8,
    right: 8,
    zIndex: 99,
  },
  capsule: {
    height: 56,
    backgroundColor: '#0a1d12', // Fond vert profond élégant (mieux qu'Empire)
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#008A3B',
    shadowColor: '#008A3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  vinylContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  vinylImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  vinylCenterHole: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  trackArtist: {
    color: '#A1A1AA',
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 6,
  },
  navControlBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    color: '#F59E0B', // Or élégant comme sur la capture Empire
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainPlayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F59E0B', // Bouton doré vibrant
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  mainPlayIcon: {
    color: '#000',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 1,
  },
});
