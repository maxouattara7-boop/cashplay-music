import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CashPlayColors } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { MiniPlayer } from './src/components/MiniPlayer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'profile'>('home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Écran actif */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && <HomeScreen onNavigateToLibrary={() => setActiveTab('library')} />}
        {activeTab === 'library' && <LibraryScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Mini Lecteur Audio Flottant */}
      <MiniPlayer />

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
          <Text style={[styles.tabLabel, activeTab === 'library' && styles.tabActive]}>Mes Sons</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabIcon, activeTab === 'profile' && styles.tabActive]}>👤</Text>
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabActive]}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CashPlayColors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 54,
    backgroundColor: '#0a0a0c',
    borderTopWidth: 1,
    borderTopColor: CashPlayColors.border,
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
