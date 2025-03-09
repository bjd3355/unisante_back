import { Injectable } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailService {
  async sendVerificationCode(email: string) {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    // Utilisation directe de la clé API dans le code (attention : ceci n'est pas recommandé pour la production)
    apiKey.apiKey = "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";

    const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Générer un code aléatoire à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    sendSmtpEmail.sender = { name: "UniSanté", email: "josephmahoukou3@gmail.com" };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Votre code de vérification";
    sendSmtpEmail.htmlContent = `
      <p>Bonjour,</p>
      <p>Merci d'utiliser UniSanté. Votre code de vérification est : <strong>${code}</strong>.</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.</p>
      <p>Cordialement,<br>L'équipe UniSanté</p>
    `;

    try {
      await transactionalApi.sendTransacEmail(sendSmtpEmail);
      return { success: true, code }; // Retourner le code généré
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
      throw new Error("Impossible d'envoyer l'email.");
    }
  }
}
