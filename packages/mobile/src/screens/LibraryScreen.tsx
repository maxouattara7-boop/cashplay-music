import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CashPlayColors } from '../theme/colors';
import { offlineVault } from '../services/offlineVault.service';
import { mobileAudio } from '../services/audioManager.service';

export const LibraryScreen: React.FC = () => {
  const [offlineOnly, setOfflineOnly] = useState(false);

  const purchasedTracks = [
    {
      id: 'purchased-1',
      title: 'Burkina Faso N°1',
      artist: 'Amzy feat. Kayawoto',
      isOfflineSaved: true,
      size: '8.4 Mo',
    },
    {
      id: 'purchased-2',
      title: 'Dounia (Version Intégrale)',
      artist: 'Floby',
      isOfflineSaved: true,
      size: '6.2 Mo',
    },
    {
      id: 'purchased-3',
      title: 'Yam Wêmdé',
      artist: 'Smarty',
      isOfflineSaved: false,
      size: '7.8 Mo',
    },
  ];

  const displayedTracks = offlineOnly
    ? purchasedTracks.filter((t) => t.isOfflineSaved)
    : purchasedTracks;

  const handlePlayTrack = (track: any) => {
    mobileAudio.loadTrack({
      id: track.id,
      title: track.title,
      artistName: track.artist,
      coverUrl: '',
      audioUri: `vault://${track.id}.cpm`,
      durationSeconds: 210,
      isPreview: false,
      isOfflineEncrypted: track.isOfflineSaved,
    });
    mobileAudio.play();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Sons</Text>
        <Text style={styles.subtitle}>Bibliothèque d'écoute illimitée et sécurisée</Text>

        {/* Bouton Filtre Mode Hors-ligne */}
        <TouchableOpacity
          style={[styles.offlineFilter, offlineOnly && styles.offlineFilterActive]}
          onPress={() => setOfflineOnly(!offlineOnly)}
        >
          <Text style={[styles.offlineFilterText, offlineOnly && styles.offlineFilterTextActive]}>
            {offlineOnly ? '✓ Mode Hors-Ligne Uniquement' : 'Filtrer par sons téléchargés (Hors-Ligne)'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {displayedTracks.map((item) => (
          <View key={item.id} style={styles.trackCard}>
            <TouchableOpacity style={styles.playIcon} onPress={() => handlePlayTrack(item)}>
              <Text style={styles.playIconText}>▶</Text>
            </TouchableOpacity>

            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{item.title}</Text>
              <Text style={styles.trackArtist}>{item.artist}</Text>
            </View>

            <View style={styles.badgeColumn}>
              {item.isOfflineSaved ? (
                <View style={styles.offlineBadge}>
                  <Text style={styles.offlineBadgeText}>🔒 Hors-Ligne</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.downloadButton}>
                  <Text style={styles.downloadButtonText}>⬇ Télécharger</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.fileSize}>{item.size}</Text>
            </View>
          </View>
        ))}

        <View style={styles.securityNote}>
          <Text style={styles.securityTitle}>🔒 Protection Anti-Piratage Active</Text>
          <Text style={styles.securityDesc}>
            Vos morceaux téléchargés sont chiffrés et scellés dans l'espace sécurisé de l'application. Vous pouvez les écouter sans connexion Internet partout, sans risque de fuite de fichier.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CashPlayColors.background,
  },
  header: {
    padding: 16,
    paddingTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: CashPlayColors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: CashPlayColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: CashPlayColors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  offlineFilter: {
    backgroundColor: CashPlayColors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CashPlayColors.border,
    alignSelf: 'flex-start',
  },
  offlineFilterActive: {
    borderColor: CashPlayColors.primary,
    backgroundColor: CashPlayColors.primaryDark + '30',
  },
  offlineFilterText: {
    color: CashPlayColors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  offlineFilterTextActive: {
    color: CashPlayColors.primary,
  },
  list: {
    padding: 16,
    paddingBottom: 90,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CashPlayColors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CashPlayColors.border,
  },
  playIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CashPlayColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playIconText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
  },
  trackArtist: {
    fontSize: 11,
    color: CashPlayColors.textSecondary,
    marginTop: 2,
  },
  badgeColumn: {
    alignItems: 'flex-end',
  },
  offlineBadge: {
    backgroundColor: CashPlayColors.primaryDark + '40',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: CashPlayColors.primary,
  },
  offlineBadgeText: {
    color: CashPlayColors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  downloadButton: {
    backgroundColor: CashPlayColors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  downloadButtonText: {
    color: CashPlayColors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  fileSize: {
    fontSize: 9,
    color: CashPlayColors.textMuted,
    marginTop: 4,
  },
  securityNote: {
    marginTop: 20,
    backgroundColor: CashPlayColors.surfaceLight + '40',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: CashPlayColors.border,
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: CashPlayColors.primary,
    marginBottom: 4,
  },
  securityDesc: {
    fontSize: 11,
    color: CashPlayColors.textSecondary,
    lineHeight: 16,
  },
});
