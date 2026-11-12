import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { CashPlayColors } from '../theme/colors';
import { mobileAudio, MobileTrack } from '../services/audioManager.service';

export const HomeScreen: React.FC<{ onNavigateToLibrary: () => void }> = ({ onNavigateToLibrary }) => {
  const [activeCategory, setActiveCategory] = useState('Tous');

  const preOrders = [
    {
      id: 'pre-1',
      title: 'Burkina Faso N°1',
      artist: 'Amzy feat. Kayawoto',
      days: 6,
      price: '500 F CFA',
      genre: 'Afro-Rap',
      uri: 'https://cdn.cashplay.africa/previews/1.mp3',
    },
    {
      id: 'pre-2',
      title: 'Yam Wêmdé',
      artist: 'Smarty',
      days: 11,
      price: '1 000 F CFA',
      genre: 'Hip-Hop Africain',
      uri: 'https://cdn.cashplay.africa/previews/2.mp3',
    },
  ];

  const handlePlayPreview = (item: any) => {
    mobileAudio.loadTrack({
      id: item.id,
      title: item.title,
      artistName: item.artist,
      coverUrl: '',
      audioUri: item.uri,
      durationSeconds: 30,
      isPreview: true,
    });
    mobileAudio.play();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>CashPlay <Text style={{ color: CashPlayColors.primary }}>MUSIC</Text></Text>
        <Text style={styles.slogan}>« La musique prend de la valeur. »</Text>
      </View>

      {/* Bannière Hero */}
      <View style={styles.heroCard}>
        <Text style={styles.heroBadge}>Afrique de l'Ouest • Vente Directe</Text>
        <Text style={styles.heroTitle}>Distribuer. Vendre. Écouter.</Text>
        <Text style={styles.heroText}>
          Achetez par Orange Money, Moov Money et Wave. 80% des revenus sont directement reversés aux créateurs.
        </Text>
      </View>

      {/* Section Préventes J-14 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>✨ Exclusivités & Préventes (J-14)</Text>
          <Text style={styles.sectionSubtitle}>Titres inédits avant leur sortie officielle</Text>
        </View>

        {preOrders.map((item) => (
          <View key={item.id} style={styles.preOrderCard}>
            <View style={styles.preOrderInfo}>
              <View style={styles.daysBadge}>
                <Text style={styles.daysBadgeText}>J - {item.days} jours</Text>
              </View>
              <Text style={styles.trackTitle}>{item.title}</Text>
              <Text style={styles.trackArtist}>{item.artist}</Text>
              <Text style={styles.trackPrice}>{item.price}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.previewButton}
                onPress={() => handlePlayPreview(item)}
              >
                <Text style={styles.previewButtonText}>▶ Écouter Extrait</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.preOrderButton}>
                <Text style={styles.preOrderButtonText}>Précommander</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CashPlayColors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  header: {
    marginTop: 20,
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: CashPlayColors.textPrimary,
  },
  slogan: {
    fontSize: 12,
    color: CashPlayColors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  heroCard: {
    backgroundColor: CashPlayColors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: CashPlayColors.primaryDark,
    marginBottom: 24,
  },
  heroBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: CashPlayColors.primary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
    marginBottom: 6,
  },
  heroText: {
    fontSize: 12,
    color: CashPlayColors.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: CashPlayColors.textMuted,
    marginTop: 2,
  },
  preOrderCard: {
    backgroundColor: CashPlayColors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: CashPlayColors.accentGold + '40',
    marginBottom: 12,
  },
  preOrderInfo: {
    marginBottom: 12,
  },
  daysBadge: {
    backgroundColor: CashPlayColors.accentGold + '25',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  daysBadgeText: {
    color: CashPlayColors.accentGold,
    fontSize: 10,
    fontWeight: '700',
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
  },
  trackArtist: {
    fontSize: 12,
    color: CashPlayColors.textSecondary,
    marginTop: 2,
  },
  trackPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: CashPlayColors.primary,
    marginTop: 6,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  previewButton: {
    flex: 1,
    backgroundColor: CashPlayColors.surfaceLight,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  previewButtonText: {
    color: CashPlayColors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  preOrderButton: {
    flex: 1,
    backgroundColor: CashPlayColors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  preOrderButtonText: {
    color: CashPlayColors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
});
