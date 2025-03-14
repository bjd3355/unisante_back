import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-code')
  async sendVerificationCode(@Body('email') email: string) {
    return await this.mailService.sendVerificationCode(email);
  }

  @Post('reset-password')
  async resetPassword(@Body('email') email: string) {
    return await this.mailService.resetPassword(email);
  }

}