import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { CashPlayColors } from '../theme/colors';

export interface UserAuthData {
  name: string;
  identifier: string;
  role: 'auditor' | 'artist';
}

interface AuthScreenProps {
  onLoginSuccess: (user: UserAuthData) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Champs de saisie
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'auditor' | 'artist'>('auditor');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Connexion Google
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Maxime Ouattara',
        identifier: 'maxime.ouattara@gmail.com',
        role: selectedRole,
      });
    }, 1200);
  };

  // Soumission du formulaire classique
  const handleSubmit = () => {
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Email ou numéro requis.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMessage('Mot de passe d\'au moins 4 caractères requis.');
      return;
    }

    if (authMode === 'REGISTER' && !fullName.trim()) {
      setErrorMessage('Nom complet requis.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: fullName.trim() || 'Auditeur CashPlay',
        identifier: identifier.trim(),
        role: selectedRole,
      });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      {/* CONTENEUR FIXE PLEINE PAGE (SANS DÉFILEMENT) */}
      <View style={styles.mainFixedContainer}>
        {/* 1. SECTION LOGO EN HAUT (Compact & Raffiné) */}
        <View style={styles.brandSection}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/cashplay-logo.jpg')}
              style={styles.officialLogoImage}
            />
          </View>
          <Text style={styles.brandTagline}>
            La musique prend de la valeur.
          </Text>
        </View>

        {/* 2. CARTE FORMULAIRE CENTRÉE */}
        <View style={styles.cardContainer}>
          {/* ONGLETS BASCULE : CONNEXION / INSCRIPTION */}
          <View style={styles.authTabs}>
            <TouchableOpacity
              style={[styles.authTab, authMode === 'LOGIN' && styles.authTabActive]}
              onPress={() => {
                setAuthMode('LOGIN');
                setErrorMessage('');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.authTabText, authMode === 'LOGIN' && styles.authTabTextActive]}>
                Connexion
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authTab, authMode === 'REGISTER' && styles.authTabActive]}
              onPress={() => {
                setAuthMode('REGISTER');
                setErrorMessage('');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.authTabText, authMode === 'REGISTER' && styles.authTabTextActive]}>
                Inscription
              </Text>
            </TouchableOpacity>
          </View>

          {/* BOUTON GOOGLE / GMAIL OFFICIEL & OPTIMISÉ */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {/* Logo Google Stylisé avec pastille aux couleurs officielles */}
            <View style={styles.googleIconCircle}>
              <Text style={styles.googleIconLetter}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Continuer avec Google</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou avec vos identifiants</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* MESSAGE D'ERREUR */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* SI INSCRIPTION : CHOIX DU RÔLE */}
          {authMode === 'REGISTER' && (
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Profil :</Text>
              <View style={styles.roleButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.roleChoiceBtn,
                    selectedRole === 'auditor' && styles.roleChoiceBtnActive,
                  ]}
                  onPress={() => setSelectedRole('auditor')}
                >
                  <Text style={styles.roleChoiceText}>🎧 Mélomane</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleChoiceBtn,
                    selectedRole === 'artist' && styles.roleChoiceBtnActive,
                  ]}
                  onPress={() => setSelectedRole('artist')}
                >
                  <Text style={styles.roleChoiceText}>🎤 Artiste (80%)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* SI INSCRIPTION : NOM COMPLET */}
          {authMode === 'REGISTER' && (
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Nom complet ou de scène :</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Ex: Maxime Ouattara"
                placeholderTextColor="#71717A"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          )}

          {/* IDENTIFIANT (NUMÉRO OU EMAIL) */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Numéro de téléphone ou Email :</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Ex: +226 70 00 00 00 ou nom@gmail.com"
              placeholderTextColor="#71717A"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* MOT DE PASSE */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Mot de passe :</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#71717A"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.showPassBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showPassIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* LIEN MOT DE PASSE OUBLIÉ */}
          {authMode === 'LOGIN' && (
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => alert('Veuillez contacter le support WhatsApp CashPlay.')}
            >
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          )}

          {/* BOUTON DE CONNEXION PRINCIPAL */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {authMode === 'LOGIN' ? 'Se connecter à CashPlay' : 'Créer mon compte'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 3. MENTION LÉGALE BAS DE PAGE */}
        <Text style={styles.legalNotice}>
          En continuant, vous soutenez directement les artistes africains.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#041008', // Vert très profond immersif
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0,
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0,138,59,0.25)',
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: -60,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0,138,59,0.15)',
  },
  mainFixedContainer: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  logoWrapper: {
    width: 66,
    height: 66,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#008A3B',
    marginBottom: 6,
    shadowColor: '#008A3B',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  officialLogoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  brandTagline: {
    fontSize: 11.5,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0c150f',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,138,59,0.4)',
    shadowColor: '#008A3B',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  authTabs: {
    flexDirection: 'row',
    backgroundColor: '#050c07',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  authTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 7,
  },
  authTabActive: {
    backgroundColor: CashPlayColors.primary,
  },
  authTabText: {
    color: '#9CA3AF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  authTabTextActive: {
    color: '#FFF',
    fontWeight: '900',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 44,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EA4335', // Rouge Google vibrant
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  googleIconLetter: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    color: '#71717A',
    fontSize: 10.5,
    paddingHorizontal: 8,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  roleButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChoiceBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121f16',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  roleChoiceBtnActive: {
    backgroundColor: 'rgba(0,138,59,0.25)',
    borderColor: CashPlayColors.primary,
  },
  roleChoiceText: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  inputField: {
    backgroundColor: '#121f16',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: '#FFF',
    fontSize: 12.5,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121f16',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 12.5,
    paddingVertical: 9,
  },
  showPassBtn: {
    padding: 4,
  },
  showPassIcon: {
    fontSize: 14,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  forgotText: {
    color: CashPlayColors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: CashPlayColors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#008A3B',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  legalNotice: {
    color: '#71717A',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 6,
  },
});
