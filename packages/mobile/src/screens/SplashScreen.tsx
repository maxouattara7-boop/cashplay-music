import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Easing,
  StatusBar,
} from 'react-native';
import { CashPlayColors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const AnimatedSplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Valeurs d'animation
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoSpin = useRef(new Animated.Value(0)).current;
  
  // Transformation vers le bouton Play
  const playButtonScale = useRef(new Animated.Value(0)).current;
  const playButtonOpacity = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0.8)).current;

  // Fondu de sortie global
  const containerOpacity = useRef(new Animated.Value(1)).current;

  const [step, setStep] = useState<'LOGO' | 'PLAY_BUTTON'>('LOGO');

  useEffect(() => {
    // 1. ÉTAPE 1 : Apparition progressive du Logo en grand format immersif
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoSpin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Pause de 500ms puis passage à l'étape 2
      setTimeout(() => {
        setStep('PLAY_BUTTON');

        // 2. ÉTAPE 2 : Métamorphose du Logo en Bouton Play vibrant
        Animated.parallel([
          // Rétractation douce du logo
          Animated.timing(logoScale, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          // Éclosion proéminente du Bouton Play lumineux
          Animated.spring(playButtonScale, {
            toValue: 1,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(playButtonOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Onde de choc (ripple sonore) du bouton Play
          Animated.loop(
            Animated.parallel([
              Animated.timing(rippleScale, {
                toValue: 2.2,
                duration: 900,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(rippleOpacity, {
                toValue: 0,
                duration: 900,
                useNativeDriver: true,
              }),
            ])
          ).start();

          // 3. ÉTAPE 3 : Transition finale en fondu vers la plateforme
          setTimeout(() => {
            Animated.timing(containerOpacity, {
              toValue: 0,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }).start(() => {
              onFinish();
            });
          }, 1100);
        });
      }, 700);
    });
  }, []);

  const spinInterpolation = logoSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  return (
    <Animated.View style={[styles.fullContainer, { opacity: containerOpacity }]}>
      <StatusBar hidden />

      {/* Halos lumineux vert et or en arrière-plan */}
      <View style={styles.ambientGlowPrimary} />
      <View style={styles.ambientGlowGold} />

      {/* 1. SECTION LOGO EN PLEINE PAGE */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { rotate: spinInterpolation },
            ],
          },
        ]}
      >
        <View style={styles.logoFrame}>
          <Image
            source={require('../../assets/cashplay-logo.jpg')}
            style={styles.logoFullImage}
          />
        </View>
        <Text style={styles.brandTitle}>
          CashPlay <Text style={{ color: CashPlayColors.primary }}>MUSIC</Text>
        </Text>
        <Text style={styles.brandSlogan}>
          La musique africaine légale et directe
        </Text>
      </Animated.View>

      {/* 2. SECTION BOUTON PLAY ANIMÉ DE MÉTAMORPHOSE */}
      <Animated.View
        style={[
          styles.playButtonWrapper,
          {
            opacity: playButtonOpacity,
            transform: [{ scale: playButtonScale }],
          },
        ]}
      >
        {/* Onde de pulsation (Ripple acoustique) */}
        <Animated.View
          style={[
            styles.rippleRing,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />

        {/* Le Bouton Play Principal */}
        <View style={styles.playButtonGlow}>
          <View style={styles.playButtonInner}>
            <Text style={styles.playTriangleIcon}>▶</Text>
          </View>
        </View>

        <Text style={styles.loadingText}>Lancement de CashPlay...</Text>
      </Animated.View>

      {/* Badge signature bas de page */}
      <View style={styles.footerNote}>
        <Text style={styles.footerText}>Plateforme Endogène de Distribution</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#041008', // Vert très profond immersif
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  ambientGlowPrimary: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: 'rgba(0,138,59,0.22)',
    top: height * 0.15,
  },
  ambientGlowGold: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: 'rgba(245,158,11,0.1)',
    bottom: height * 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  logoFrame: {
    width: width * 0.58,
    height: width * 0.58,
    maxWidth: 240,
    maxHeight: 240,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#008A3B',
    shadowColor: '#008A3B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 20,
  },
  logoFullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandSlogan: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  playButtonWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: '#008A3B',
    backgroundColor: 'rgba(0,138,59,0.15)',
  },
  playButtonGlow: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: 'rgba(0,138,59,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#008A3B',
    shadowColor: '#008A3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 18,
    elevation: 12,
  },
  playButtonInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F59E0B', // Or CashPlay étincelant
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playTriangleIcon: {
    color: '#041008',
    fontSize: 34,
    fontWeight: '900',
    marginLeft: 6,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 22,
    letterSpacing: 0.5,
  },
  footerNote: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
