import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { CashPlayColors } from '../theme/colors';
import { mobileAudio } from '../services/audioManager.service';

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2;

interface HomeScreenProps {
  onOpenDrawer: () => void;
  onNavigateToLibrary: () => void;
  onNavigateToProfile: () => void;
  onSelectTrack?: (track: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenDrawer,
  onNavigateToLibrary,
  onNavigateToProfile,
  onSelectTrack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PREORDERS' | 'POPULAR'>('ALL');

  // Bannières "Bientôt / En Prévente" en carrousel horizontal (inspiré du haut d'Empire Afrique)
  const featuredBanners = [
    {
      id: 'banner-1',
      badge: 'BIENTÔT EN DÉCEMBRE',
      title: 'MFA (Musique Franco-Africaine)',
      subtitle: 'Sortie Exclusive en Prévente J-14',
      bgGradient: ['#006B2E', '#0a0c0e'],
    },
    {
      id: 'banner-2',
      badge: 'VENTE DIRECTE',
      title: 'Bass Toub Gomé - Thomy',
      subtitle: 'Soutenez l\'artiste par Mobile Money',
      bgGradient: ['#1e3a8a', '#0a0c0e'],
    },
  ];

  // Catalogue 2 colonnes (comme Empire Afrique mais avec la typographie et le style CashPlay)
  const catalogTracks = [
    {
      id: 'cat-1',
      title: '15.01 (EP Exclusif)',
      artist: 'Moms Loup',
      priceXOF: '2 000 XOF',
      salesCount: 429,
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      isPreOrder: false,
    },
    {
      id: 'cat-2',
      title: 'Bass Toub Gomé',
      artist: 'Thomy',
      priceXOF: '2 000 XOF',
      salesCount: 154,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      isPreOrder: true,
      days: 6,
    },
    {
      id: 'cat-3',
      title: 'Epectase (Album)',
      artist: 'Marko',
      priceXOF: '2 000 XOF',
      salesCount: 38,
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      isPreOrder: false,
    },
    {
      id: 'cat-4',
      title: 'Likambia',
      artist: 'Elty',
      priceXOF: '2 000 XOF',
      salesCount: 82,
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
      audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      isPreOrder: false,
    },
    {
      id: 'cat-5',
      title: 'Farafina Beat',
      artist: 'Amzy feat. Kayawoto',
      priceXOF: '500 XOF',
      salesCount: 512,
      coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
      audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      isPreOrder: true,
      days: 4,
    },
    {
      id: 'cat-6',
      title: 'Dounia (Remix)',
      artist: 'Floby',
      priceXOF: '200 XOF',
      salesCount: 789,
      coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
      audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      isPreOrder: false,
    },
  ];

  const filteredTracks = catalogTracks.filter((track) => {
    if (selectedFilter === 'PREORDERS' && !track.isPreOrder) return false;
    if (selectedFilter === 'POPULAR' && track.salesCount < 100) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return track.title.toLowerCase().includes(q) || track.artist.toLowerCase().includes(q);
    }
    return true;
  });

  const handlePlayTrack = (track: any) => {
    mobileAudio.loadTrack({
      id: track.id,
      title: track.title,
      artistName: track.artist,
      coverUrl: track.coverUrl,
      audioUri: track.audioUri,
      durationSeconds: 30,
      isPreview: true,
    });
    mobileAudio.play();
  };

  return (
    <View style={styles.container}>
      {/* 1. HEADER SUPÉRIEUR ÉLÉGANT (Inspiré d'Empire Afrique avec Hamburger + Actions Circulaires) */}
      <View style={styles.topHeader}>
        {/* Bouton Hamburger pour ouvrir le Drawer latéral */}
        <TouchableOpacity style={styles.hamburgerButton} onPress={onOpenDrawer} activeOpacity={0.7}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>

        {/* Logo / Nom de la marque */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>
            CashPlay <Text style={{ color: CashPlayColors.primary }}>MUSIC</Text>
          </Text>
        </View>

        {/* Actions circulaires à droite (comme sur Empire Afrique) */}
        <View style={styles.headerRightActions}>
          {/* Lecteur Rapide */}
          <TouchableOpacity
            style={styles.actionCircleButton}
            onPress={onNavigateToLibrary}
            activeOpacity={0.7}
            title="Mon Lecteur Hors-Ligne"
          >
            <Text style={styles.actionCircleText}>▶</Text>
          </TouchableOpacity>

          {/* Mes Achats / Cloud */}
          <TouchableOpacity
            style={styles.actionCircleButton}
            onPress={onNavigateToLibrary}
            activeOpacity={0.7}
            title="Mes Achats"
          >
            <Text style={styles.actionCircleText}>☁️</Text>
          </TouchableOpacity>

          {/* Recherche */}
          <TouchableOpacity
            style={[styles.actionCircleButton, showSearch && styles.actionCircleActive]}
            onPress={() => setShowSearch(!showSearch)}
            activeOpacity={0.7}
            title="Rechercher"
          >
            <Text style={styles.actionCircleText}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barre de Recherche dépliable */}
      {showSearch && (
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Rechercher artiste, titre, album..."
            placeholderTextColor="#71717A"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
              <Text style={{ color: '#A1A1AA', fontSize: 13 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. CARROUSEL HORIZONTAL DES BANNIÈRES (Événements & Sorties Exclusives) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerCarousel}
          contentContainerStyle={{ paddingHorizontal: 14 }}
        >
          {featuredBanners.map((banner) => (
            <View key={banner.id} style={styles.bannerCard}>
              <View style={styles.bannerBadgeContainer}>
                <Text style={styles.bannerBadgeText}>{banner.badge}</Text>
              </View>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 3. FILTRES RAPIDES */}
        <View style={styles.filtersRow}>
          {[
            { key: 'ALL', label: 'Toutes les Musiques' },
            { key: 'PREORDERS', label: '✨ Préventes J-14' },
            { key: 'POPULAR', label: '🔥 Top Ventes' },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setSelectedFilter(f.key as any)}
              style={[
                styles.filterPill,
                selectedFilter === f.key && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedFilter === f.key && styles.filterPillTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. GRILLE DE MUSIQUE 2 COLONNES (Inspirée de la capture Empire Afrique - Pochette pure sans bouton Play) */}
        <View style={styles.catalogGrid}>
          {filteredTracks.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.trackGridCard}
              activeOpacity={0.85}
              onPress={() => {
                if (onSelectTrack) {
                  onSelectTrack({
                    ...item,
                    priceXOF: 2000,
                    description: `${item.artist} vous propose cette œuvre exclusive intitulée "${item.title}". Achetez directement par Mobile Money pour soutenir l'artiste.`,
                  });
                } else {
                  handlePlayTrack(item);
                }
              }}
            >
              {/* Pochette pure sans bouton Play */}
              <View style={styles.coverWrapper}>
                <Image source={{ uri: item.coverUrl }} style={styles.coverImage} />

                {/* Badge Prévente si applicable */}
                {item.isPreOrder && (
                  <View style={styles.preOrderCornerBadge}>
                    <Text style={styles.preOrderCornerText}>J - {item.days}j</Text>
                  </View>
                )}
              </View>

              {/* Titre et Artiste (comme '15.01 - Moms Loup') */}
              <View style={styles.trackDetails}>
                <Text style={styles.trackMainTitle} numberOfLines={1}>
                  {item.title} <Text style={styles.trackArtistSeparator}>- {item.artist}</Text>
                </Text>

                {/* Prix en XOF et Nombre de Ventes (comme sur Empire) */}
                <View style={styles.priceAndSalesRow}>
                  <Text style={styles.priceXOFText}>{item.priceXOF}</Text>
                  <Text style={styles.salesCountText}>
                    {item.salesCount} {item.salesCount > 1 ? 'Ventes' : 'Vente'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070809',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#0a0c0e',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  hamburgerButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  brandContainer: {
    flex: 1,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionCircleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,138,59,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0,138,59,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircleActive: {
    backgroundColor: CashPlayColors.primary,
  },
  actionCircleText: {
    fontSize: 13,
    color: '#FFF',
  },
  searchBarContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#101216',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#FFF',
    fontSize: 13,
  },
  clearSearchBtn: {
    padding: 8,
    marginLeft: 6,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  bannerCarousel: {
    marginTop: 12,
    marginBottom: 14,
  },
  bannerCard: {
    width: width * 0.78,
    backgroundColor: '#12171c',
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,138,59,0.35)',
    shadowColor: '#008A3B',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerBadgeContainer: {
    backgroundColor: 'rgba(0,138,59,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,138,59,0.4)',
  },
  bannerBadgeText: {
    color: '#008A3B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  bannerSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 3,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  filterPillActive: {
    backgroundColor: CashPlayColors.primary,
    borderColor: CashPlayColors.primary,
  },
  filterPillText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#FFF',
  },
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    gap: 12,
  },
  trackGridCard: {
    width: cardWidth,
    backgroundColor: '#0f1115',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 8,
  },
  coverWrapper: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#1b1e24',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  preOrderCornerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  preOrderCornerText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },
  playOverlayButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CashPlayColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  playOverlayIcon: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  trackDetails: {
    padding: 10,
  },
  trackMainTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  trackArtistSeparator: {
    color: '#9CA3AF',
    fontWeight: '500',
    fontSize: 12,
  },
  priceAndSalesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceXOFText: {
    color: '#008A3B',
    fontSize: 12,
    fontWeight: '900',
  },
  salesCountText: {
    color: '#F59E0B', // Jaune/or élégant rappelant Empire Afrique
    fontSize: 11,
    fontWeight: '700',
  },
});
