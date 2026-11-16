import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CashPlayColors } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { TrackDetailScreen, TrackDetailData } from './src/screens/TrackDetailScreen';
import { MiniPlayer } from './src/components/MiniPlayer';
import { SideDrawer } from './src/components/SideDrawer';
import { AuthScreen, UserAuthData } from './src/screens/AuthScreen';
import { AnimatedSplashScreen } from './src/screens/SplashScreen';

export default function App() {
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAuthData | null>({
    name: 'Maxime Ouattara',
    identifier: 'maxime.ouattara@gmail.com',
    role: 'auditor',
  });
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'profile'>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackDetailData | null>(null);

  // 1. ANIMATION D'OUVERTURE PLEINE PAGE (Logo animé se métamorphosant en bouton Play)
  if (!isSplashFinished) {
    return <AnimatedSplashScreen onFinish={() => setIsSplashFinished(true)} />;
  }

  // 2. Si l'utilisateur n'est pas connecté, afficher la page de connexion épurée
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Écran Détail de l'Œuvre (Plein écran, Teaser vidéo, Prix, Commentaires, Achat VIP & Mobile Money) */}
      {selectedTrack ? (
        <TrackDetailScreen
          track={selectedTrack}
          onClose={() => setSelectedTrack(null)}
          onTrackPurchased={(id) => {
            setSelectedTrack(null);
            setActiveTab('library');
          }}
        />
      ) : (
        <>
          {/* Tiroir latéral ouvert par le logo CashPlay officiel */}
          <SideDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onNavigate={(tab) => {
              setActiveTab(tab);
              setIsDrawerOpen(false);
            }}
            onLogout={() => {
              setIsDrawerOpen(false);
              setCurrentUser(null);
            }}
            user={{
              name: currentUser.name,
              role: currentUser.role === 'artist' ? 'Artiste Créateur' : 'Mélomane & Auditeur',
              phone: currentUser.identifier,
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
              <ProfileScreen
                onNavigateToLibrary={() => setActiveTab('library')}
                initialRole={currentUser.role}
              />
            )}
          </View>

          {/* Mini Lecteur Audio Flottant posé élégamment en bas */}
          <MiniPlayer onNavigateToLibrary={() => setActiveTab('library')} />
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
});
