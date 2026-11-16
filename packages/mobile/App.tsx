import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CashPlayColors } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { TrackDetailScreen, TrackDetailData } from './src/screens/TrackDetailScreen';
import { MiniPlayer } from './src/components/MiniPlayer';
import { SideDrawer } from './src/components/SideDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'profile'>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackDetailData | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Écran Détail de l'Œuvre (Inspiré de la capture Empire : Plein écran, Teaser vidéo, Prix, Commentaires, Achat VIP & Mobile Money) */}
      {selectedTrack ? (
        <TrackDetailScreen
          track={selectedTrack}
          onClose={() => setSelectedTrack(null)}
          onTrackPurchased={(id) => {
            // Après achat réussi, possibilité de basculer vers Mes Achats
            setSelectedTrack(null);
            setActiveTab('library');
          }}
        />
      ) : (
        <>
          {/* Tiroir latéral inspiré d'Empire Afrique */}
          <SideDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onNavigate={(tab) => {
              setActiveTab(tab);
              setIsDrawerOpen(false);
            }}
            user={{
              name: 'Maxime Ouattara',
              role: 'Auditeur & Créateur',
              phone: '+226 70 00 00 00',
            }}
          />

          {/* Écran actif */}
          <View style={styles.screenContainer}>
            {activeTab === 'home' && (
              <HomeScreen
                onOpenDrawer={() => setIsDrawerOpen(true)}
                onNavigateToLibrary={() => setActiveTab('library')}
                onNavigateToProfile={() => setActiveTab('profile')}
                onSelectTrack={(track) => setSelectedTrack(track)}
              />
            )}
            {activeTab === 'library' && <LibraryScreen />}
            {activeTab === 'profile' && (
              <ProfileScreen onNavigateToLibrary={() => setActiveTab('library')} />
            )}
          </View>

          {/* Mini Lecteur Audio Flottant style Empire Afrique */}
          <MiniPlayer onNavigateToLibrary={() => setActiveTab('library')} />

          {/* Barre d'onglets de navigation inférieure */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('home')}
            >
              <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabActive]}>🏠</Text>
              <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabActive]}>Accueil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('library')}
            >
              <Text style={[styles.tabIcon, activeTab === 'library' && styles.tabActive]}>🎵</Text>
              <Text style={[styles.tabLabel, activeTab === 'library' && styles.tabActive]}>Mes Achats</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('profile')}
            >
              <Text style={[styles.tabIcon, activeTab === 'profile' && styles.tabActive]}>👤</Text>
              <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabActive]}>Mon Compte</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CashPlayColors.background,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: '#0a0a0c',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 16,
    color: CashPlayColors.textMuted,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: CashPlayColors.textMuted,
    marginTop: 2,
  },
  tabActive: {
    color: CashPlayColors.primary,
  },
});
