import { validateConfig } from '@/helpers';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

export interface GoogleOauthConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

class EnvironmentVariablesValidator {
  @IsString()
  GOOGLE_CLIENT_ID!: string;

  @IsString()
  GOOGLE_SECRET!: string;

  @IsString()
  GOOGLE_CALLBACK_URL!: string;
}

export default registerAs<GoogleOauthConfig>('googleOauth', () => {
  Logger.log('validate Google Oauth config');
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
  };
});
