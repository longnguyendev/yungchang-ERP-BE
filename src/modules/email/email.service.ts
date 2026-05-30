import { AppConfig } from '@/common/config/app.config';
import { renderResetEmail, renderVerifyEmail } from '@/helpers';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('email.username', { infer: true })!,
        pass: this.configService.get('email.password', { infer: true })!,
      },
    });
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const resetLink = `${this.configService.get('server.feHost', { infer: true })!}/auth/reset-password?email=${to}&token=${token}`;
    const mailOptions: Options = {
      from: `"Quang Minh" ${this.configService.get('email.username', { infer: true })}`,
      to,
      subject: 'Đặt lại mật khẩu',
      html: renderResetEmail(resetLink),
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendVerifyUserEmail(email: string, otp: string) {
    const mailOptions: Options = {
      from: `"Quang Minh" ${this.configService.get('email.username', { infer: true })}`,
      to: `${this.configService.get('email.username', { infer: true })}`,
      subject: `Xác thực người dùng: ${email}`,
      html: renderVerifyEmail(email, otp),
    };

    await this.transporter.sendMail(mailOptions);
  }
}
