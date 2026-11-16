import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import { CashPlayColors } from '../theme/colors';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: 'home' | 'library' | 'profile') => void;
  user?: {
    name: string;
    role: string;
    phone?: string;
  };
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  user = { name: 'Maxime Ouattara', role: 'Auditeur & Créateur', phone: '+226 70 XX XX XX' },
}) => {
  if (!isOpen) return null;

  // Liste épurée sans sous-titres verts, avec les libellés demandés
  const menuItems = [
    {
      id: 'offline-player',
      icon: '▶',
      label: 'Mon Lecteur (Hors-Ligne)',
      action: () => {
        onClose();
        onNavigate('library');
      },
    },
    {
      id: 'music-sales',
      icon: '🛒',
      label: 'Musiques en vente',
      action: () => {
        onClose();
        onNavigate('home');
      },
    },
    {
      id: 'pre-orders',
      icon: '✨',
      label: 'Préventes Exclusives', // Sans (J-14)
      action: () => {
        onClose();
        onNavigate('home');
      },
    },
    {
      id: 'my-purchases',
      icon: '☁️',
      label: 'Mes Achats',
      action: () => {
        onClose();
        onNavigate('library');
      },
    },
    {
      id: 'referrals',
      icon: '🎁',
      label: 'Parrainage & Téléchargement Offert',
      action: () => {
        onClose();
        onNavigate('profile');
      },
    },
    {
      id: 'creator-space',
      icon: '💼',
      label: 'Espace Artiste', // Espace Artiste simplement, sans SasPay ni badge
      action: () => {
        onClose();
        onNavigate('profile');
      },
    },
    {
      id: 'support',
      icon: '💬',
      label: 'Support & Assistance WhatsApp',
      action: () => {
        Linking.openURL('https://wa.me/22670000000?text=Bonjour%20CashPlay%20Music');
        onClose();
      },
    },
    {
      id: 'about',
      icon: 'ℹ️',
      label: 'À propos de CashPlay Music',
      action: () => {
        onClose();
      },
    },
  ];

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Volet cliquable extérieur pour fermer */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        {/* Tiroir coulissant latéral avec compensation StatusBar Android */}
        <SafeAreaView style={styles.drawerSafeArea}>
          <View style={styles.drawerContainer}>
            {/* En-tête Profil Utilisateur */}
            <View style={styles.profileSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>MO</Text>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <TouchableOpacity onPress={() => { onClose(); onNavigate('profile'); }}>
                <Text style={styles.userRole}>Mon Compte • {user.role}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            {/* Liste des Menus Épurée (sans les badges/sous-titres verts) */}
            <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuRow}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Pied de Tiroir aéré */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.logoutButton} onPress={onClose}>
                <Text style={styles.logoutText}>Se déconnecter</Text>
              </TouchableOpacity>
              <Text style={styles.versionText}>v1.0.0</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  backdrop: {
    flex: 1,
  },
  drawerSafeArea: {
    width: '82%',
    maxWidth: 320,
    backgroundColor: '#0e1013',
    height: '100%',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#0e1013',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,138,59,0.3)',
    shadowColor: '#008A3B',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#121519',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CashPlayColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
  },
  userRole: {
    fontSize: 12,
    color: CashPlayColors.primary,
    fontWeight: '700',
    marginTop: 3,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  menuScroll: {
    flex: 1,
    paddingVertical: 6,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,138,59,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#EDEDED',
  },
  chevron: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.25)',
    fontWeight: '300',
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0a0c0e',
  },
  logoutButton: {
    paddingVertical: 4,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 12.5,
    fontWeight: '800',
  },
  versionText: {
    color: CashPlayColors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
