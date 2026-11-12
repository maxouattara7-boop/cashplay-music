import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/prisma.service';
import { appConfig } from '../../config/env';
import { UserRole } from '@prisma/client';

export interface RegisterDTO {
  email?: string;
  phone?: string;
  fullName: string;
  password?: string;
  role?: UserRole;
  stageName?: string;  // Si profil Artiste
  labelName?: string;  // Si profil Label
  referralCode?: string; // Si parrainé par un auditeur
}

export interface LoginDTO {
  identifier: string; // Email ou Téléphone
  password?: string;
}

export class AuthService {
  /**
   * Création d'un nouvel utilisateur (Auditeur, Artiste ou Label)
   */
  async register(data: RegisterDTO) {
    if (!data.email && !data.phone) {
      throw new Error('Un email ou un numéro de téléphone est requis');
    }

    // Vérifier l'unicité
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          data.email ? { email: data.email } : {},
          data.phone ? { phone: data.phone } : {},
        ],
      },
    });

    if (existingUser) {
      throw new Error('Un compte existe déjà avec cet email ou ce numéro de téléphone');
    }

    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;
    const role = data.role || UserRole.AUDITOR;

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        fullName: data.fullName,
        passwordHash,
        role,
      },
      include: {
        artistProfile: true,
        labelProfile: true,
      },
    });

    // Profil additionnel si Artiste
    if (role === UserRole.ARTIST) {
      await prisma.artistProfile.create({
        data: {
          userId: user.id,
          stageName: data.stageName || data.fullName,
        },
      });
    }

    // Profil additionnel si Label
    if (role === UserRole.LABEL) {
      await prisma.labelProfile.create({
        data: {
          userId: user.id,
          labelName: data.labelName || data.fullName,
        },
      });
    }

    // Prise en compte du parrainage
    if (data.referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: data.referralCode },
      });
      if (referrer && referrer.id !== user.id) {
        await prisma.affiliation.create({
          data: {
            referrerId: referrer.id,
            referredUserId: user.id,
          },
        });
      }
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        referralCode: user.referralCode,
      },
      token,
    };
  }

  /**
   * Connexion avec Email ou Téléphone
   */
  async login(data: LoginDTO) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.identifier }, { phone: data.identifier }],
      },
      include: {
        artistProfile: true,
        labelProfile: true,
      },
    });

    if (!user || !user.passwordHash || !data.password) {
      throw new Error('Identifiants invalides');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Identifiants invalides');
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        artistProfile: user.artistProfile,
        labelProfile: user.labelProfile,
        referralCode: user.referralCode,
      },
      token,
    };
  }

  /**
   * Génération de token JWT
   */
  generateToken(userId: string, role: UserRole): string {
    return jwt.sign({ userId, role }, appConfig.jwt.secret, {
      expiresIn: appConfig.jwt.expiresIn as any,
    });
  }

  /**
   * Récupération du profil connecté
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        artistProfile: true,
        labelProfile: true,
      },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      referralCode: user.referralCode,
      artistProfile: user.artistProfile,
      labelProfile: user.labelProfile,
    };
  }
}

export const authService = new AuthService();
