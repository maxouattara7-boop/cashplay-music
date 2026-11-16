import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
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
  const [identifier, setIdentifier] = useState(''); // Email ou Numéro
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'auditor' | 'artist'>('auditor');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Connexion Google / Gmail
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
      setErrorMessage('Veuillez renseigner votre email ou numéro de téléphone.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMessage('Le mot de passe doit contenir au moins 4 caractères.');
      return;
    }

    if (authMode === 'REGISTER' && !fullName.trim()) {
      setErrorMessage('Veuillez renseigner votre nom complet.');
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* LOGO & IDENTITÉ CASHPLAY MUSIC */}
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <View style={styles.logoVinylDisc}>
              <Text style={styles.logoLetter}>CP</Text>
            </View>
          </View>

          <Text style={styles.brandTitle}>
            CashPlay <Text style={{ color: CashPlayColors.primary }}>MUSIC</Text>
          </Text>
          <Text style={styles.brandTagline}>
            La musique africaine légale, directe et équitable.
          </Text>
        </View>

        {/* CONTENEUR DU FORMULAIRE ÉPURÉ */}
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

          {/* BOUTON GOOGLE / GMAIL */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <View style={styles.googleIconBadge}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Continuer avec Google (Gmail)</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou avec vos identifiants</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* MESSAGE D'ERREUR ÉVENTUEL */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* SI INSCRIPTION : SÉLECTION DU RÔLE (MÉLOMANE OU ARTISTE) */}
          {authMode === 'REGISTER' && (
            <View style={styles.roleSelectionBox}>
              <Text style={styles.fieldLabel}>Type de profil souhaité :</Text>
              <View style={styles.roleButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.roleChoiceBtn,
                    selectedRole === 'auditor' && styles.roleChoiceBtnActive,
                  ]}
                  onPress={() => setSelectedRole('auditor')}
                >
                  <Text style={styles.roleChoiceIcon}>🎧</Text>
                  <Text
                    style={[
                      styles.roleChoiceText,
                      selectedRole === 'auditor' && styles.roleChoiceTextActive,
                    ]}
                  >
                    Mélomane
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleChoiceBtn,
                    selectedRole === 'artist' && styles.roleChoiceBtnActive,
                  ]}
                  onPress={() => setSelectedRole('artist')}
                >
                  <Text style={styles.roleChoiceIcon}>🎤</Text>
                  <Text
                    style={[
                      styles.roleChoiceText,
                      selectedRole === 'artist' && styles.roleChoiceTextActive,
                    ]}
                  >
                    Artiste (80%)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* SI INSCRIPTION : NOM & PRÉNOM */}
          {authMode === 'REGISTER' && (
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Nom complet ou Nom de scène :</Text>
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

          {/* NUMÉRO OU EMAIL */}
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
            <TouchableOpacity style={styles.forgotBtn} onPress={() => alert('Veuillez contacter le support WhatsApp pour réinitialiser votre accès.')}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          )}

          {/* BOUTON D'ACTION PRINCIPAL */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {authMode === 'LOGIN' ? 'Se connecter à CashPlay' : 'Créer mon compte'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* PIED DE PAGE */}
        <Text style={styles.legalNotice}>
          En continuant, vous soutenez directement les créateurs de musique africaine.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#05140b', // Fond vert très sombre épuré
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0,
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -80,
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0,138,59,0.18)',
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: -100,
    right: -50,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0,138,59,0.12)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(0,138,59,0.25)',
    borderWidth: 2,
    borderColor: '#008A3B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#008A3B',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  logoVinylDisc: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0a0c0e',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: '#008A3B',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 12.5,
    color: '#A1A1AA',
    marginTop: 4,
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0f1712',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0,138,59,0.4)',
    shadowColor: '#008A3B',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  authTabs: {
    flexDirection: 'row',
    backgroundColor: '#090f0b',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  authTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  authTabActive: {
    backgroundColor: CashPlayColors.primary,
  },
  authTabText: {
    color: '#9CA3AF',
    fontSize: 13,
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
    paddingVertical: 13,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  googleG: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4285F4',
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 13.5,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    color: '#71717A',
    fontSize: 11,
    paddingHorizontal: 10,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '700',
  },
  roleSelectionBox: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: '#D1D5DB',
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  roleButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16231a',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 6,
  },
  roleChoiceBtnActive: {
    backgroundColor: 'rgba(0,138,59,0.2)',
    borderColor: CashPlayColors.primary,
  },
  roleChoiceIcon: {
    fontSize: 14,
  },
  roleChoiceText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
  },
  roleChoiceTextActive: {
    color: '#FFF',
    fontWeight: '900',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputField: {
    backgroundColor: '#16231a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: '#FFF',
    fontSize: 13.5,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16231a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13.5,
    paddingVertical: 11,
  },
  showPassBtn: {
    padding: 6,
  },
  showPassIcon: {
    fontSize: 15,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: CashPlayColors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: CashPlayColors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#008A3B',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  legalNotice: {
    color: '#71717A',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});
