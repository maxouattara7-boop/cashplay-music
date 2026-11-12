import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CashPlayColors } from '../theme/colors';
import { mobileAudio } from '../services/audioManager.service';

interface MiniPlayerProps {
  onPress?: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress }) => {
  const current = mobileAudio.getCurrentTrack();
  if (!current) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.trackInfo} onPress={onPress}>
        <View style={styles.coverPlaceholder}>
          <Text style={styles.coverText}>CP</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {current.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {current.artistName} {current.isPreview ? '• Extrait 30s' : ''}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.playButton}
        onPress={() => {
          if (mobileAudio.isPlaying()) {
            mobileAudio.pause();
          } else {
            mobileAudio.play();
          }
        }}
      >
        <Text style={styles.playButtonText}>
          {mobileAudio.isPlaying() ? '❚❚' : '▶'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 55,
    left: 10,
    right: 10,
    height: 52,
    backgroundColor: CashPlayColors.surface,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: CashPlayColors.primaryDark,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  trackInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: CashPlayColors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  coverText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: CashPlayColors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  artist: {
    color: CashPlayColors.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },
  playButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: CashPlayColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
