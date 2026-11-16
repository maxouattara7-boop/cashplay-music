import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
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

  const menuItems = [
    {
      id: 'offline-player',
      icon: '▶',
      label: 'Mon Lecteur (Hors-Ligne)',
      badge: 'Chiffré',
      action: () => {
        onClose();
        onNavigate('library');
      },
    },
    {
      id: 'music-sales',
      icon: '🛒',
      label: 'Musiques en vente',
      badge: 'Single • EP • Album',
      action: () => {
        onClose();
        onNavigate('home');
      },
    },
    {
      id: 'pre-orders',
      icon: '✨',
      label: 'Préventes Exclusives (J-14)',
      badge: 'Inédits',
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
      badge: '5 amis = 1 son',
      action: () => {
        onClose();
        onNavigate('profile');
      },
    },
    {
      id: 'creator-space',
      icon: '💼',
      label: 'Espace Artiste / Retraits SasPay',
      badge: 'Dès 500 F',
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

        {/* Tiroir coulissant latéral */}
        <SafeAreaView style={styles.drawerContainer}>
          {/* En-tête Profil Utilisateur inspiré d'Empire mais modernisé */}
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

          {/* Liste des Menus */}
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
                  {item.badge && (
                    <Text style={styles.menuBadge}>{item.badge}</Text>
                  )}
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Pied de Tiroir */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutButton} onPress={onClose}>
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>
            <Text style={styles.versionText}>CashPlay Music v1.0.0</Text>
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
  drawerContainer: {
    width: '82%',
    maxWidth: 320,
    backgroundColor: '#0e1013',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,138,59,0.3)',
    shadowColor: '#008A3B',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#121519',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: CashPlayColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: CashPlayColors.textPrimary,
  },
  userRole: {
    fontSize: 12,
    color: CashPlayColors.primary,
    fontWeight: '700',
    marginTop: 3,
    textDecorationLine: 'underline',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  menuScroll: {
    flex: 1,
    paddingVertical: 10,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
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
    marginRight: 14,
  },
  iconText: {
    fontSize: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EDEDED',
  },
  menuBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: CashPlayColors.primary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.25)',
    fontWeight: '300',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0a0c0e',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  versionText: {
    color: CashPlayColors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
});
