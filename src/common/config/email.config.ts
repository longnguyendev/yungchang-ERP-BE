import { validateConfig } from '@/helpers';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

export interface EmailConfig {
  username: string;
  password: string;
}

class EnvironmentVariablesValidator {
  @IsString()
  SMTP_USERNAME!: string;

  @IsString()
  SMTP_PASSWORD!: string;
}

export default registerAs<EmailConfig>('email', () => {
  Logger.debug('validate Email config');
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    username: process.env.SMTP_USERNAME!,
    password: process.env.SMTP_PASSWORD!,
  };
});
