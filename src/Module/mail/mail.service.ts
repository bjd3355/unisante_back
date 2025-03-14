import { Injectable } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

dotenv.config();

@Injectable()
export class MailService {
  private verificationCodes = new Map<string, { code: string; expiresAt: number }>();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendVerificationCode(email: string) {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = "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";

    const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Expire dans 5 minutes
    this.verificationCodes.set(email, { code, expiresAt });

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
      return { success: true, code };
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
      throw new Error("Impossible d'envoyer l'email.");
    }
  }

  async resetPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("Cet email n'existe pas dans notre système.");
    }
    if (user.role === 'admin') {
      throw new Error("La réinitialisation du mot de passe est refusée pour les administrateurs.");
    }

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = "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";

    const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    sendSmtpEmail.sender = { name: "UniSanté", email: "josephmahoukou3@gmail.com" };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Votre code de réinitialisation";
    sendSmtpEmail.htmlContent = `
      <p>Bonjour,</p>
      <p>Votre code de réinitialisation est : <strong>${code}</strong>.</p>
      <p>Attention, ce code expirera dans 30 secondes.</p>
      <p>Cordialement,<br>L'équipe UniSanté</p>
    `;

    try {
      await transactionalApi.sendTransacEmail(sendSmtpEmail);
      return { success: true, code };
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
      throw new Error("Impossible d'envoyer l'email.");
    }
  }
}
