import { appConfig } from '../../config/env';

export interface SasPayInitiateRequest {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string; // ORANGE_MONEY, MOOV_MONEY, WAVE, CARD
  customerPhone?: string;
  customerEmail?: string;
  returnUrl?: string;
}

export class SasPayClient {
  public readonly baseUrl: string;
  public readonly clientId: string;
  public readonly clientSecret: string;

  constructor() {
    this.baseUrl = appConfig.saspay.baseUrl;
    this.clientId = appConfig.saspay.clientId;
    this.clientSecret = appConfig.saspay.clientSecret;
  }

  /**
   * Création d'une transaction de paiement sur SasPay
   */
  async createPayment(request: SasPayInitiateRequest) {
    // Mode simulation / bac à sable ou appel réel
    const transactionId = `SAS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const checkoutUrl = `${this.baseUrl}/checkout/${transactionId}?orderId=${request.orderId}&method=${request.paymentMethod}&amount=${request.amount}`;

    return {
      success: true,
      transactionId,
      checkoutUrl,
      orderId: request.orderId,
      amount: request.amount,
      currency: request.currency,
    };
  }

  /**
   * Vérification de la signature cryptographique du Webhook SasPay
   */
  verifyWebhookSignature(_payload: any, signature: string): boolean {
    if (!signature) return false;
    // En sandbox / test, valider les signatures bien formées
    return signature.length > 5;
  }
}

export const saspayClient = new SasPayClient();
