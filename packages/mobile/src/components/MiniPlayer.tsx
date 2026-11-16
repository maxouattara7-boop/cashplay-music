import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { CashPlayColors } from '../theme/colors';
import { mobileAudio, AudioTrack } from '../services/audioManager.service';

interface MiniPlayerProps {
  onPress?: () => void;
  onNavigateToLibrary?: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress, onNavigateToLibrary }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(mobileAudio.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState<boolean>(mobileAudio.isPlaying());

  // Animation de rotation continue à 360° pour le logo en forme de disque
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 5000, // 5 secondes pour une rotation fluide et élégante
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    return () => spinLoop.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Mise à jour de l'état audio
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrack(mobileAudio.getCurrentTrack());
      setIsPlaying(mobileAudio.isPlaying());
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Démo fallback (Yam Wêmdé - Smarty ou Moms Loup)
  const track = currentTrack || {
    id: 'demo-1',
    title: 'Yam Wêmdé',
    artistName: 'Smarty',
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
        {/* Cercle avec le logo officiel CashPlay animé qui tourne continuellement */}
        <Animated.View
          style={[
            styles.rotatingLogoCircle,
            { transform: [{ rotate: spin }] },
          ]}
        >
          <Image
            source={require('../../assets/cashplay-logo.jpg')}
            style={styles.logoDiscImage}
          />
        </Animated.View>

        {/* Détails du morceau */}
        <View style={styles.infoContainer}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {track.artistName} {track.isPreview ? '• Extrait' : ''}
          </Text>
        </View>

        {/* Commandes audio : Précédent, Play/Pause, Suivant */}
        <View style={styles.controlsRow}>
          {/* Précédent */}
          <TouchableOpacity
            style={styles.navControlBtn}
            onPress={() => mobileAudio.seek(0)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.navIcon}>⏮</Text>
          </TouchableOpacity>

          {/* Play / Pause Principal en bouton or vibrant */}
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
    bottom: 14,
    left: 8,
    right: 8,
    zIndex: 99,
  },
  capsule: {
    height: 56,
    backgroundColor: '#0a1d12', // Fond vert profond signature
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
  rotatingLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#008A3B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#008A3B',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  logoDiscImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  trackArtist: {
    color: '#A1A1AA',
    fontSize: 11,
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
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F59E0B', // Bouton doré rond comme sur la capture
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  mainPlayIcon: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 1,
  },
});
