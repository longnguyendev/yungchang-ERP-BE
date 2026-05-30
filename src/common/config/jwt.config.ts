import { validateConfig } from '@/helpers';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

export interface JwtConfig {
  secret: string;
  expirationTime: string;
  refreshSecret: string;
  refreshExpirationTime: string;
}

class EnvironmentVariablesValidator {
  @IsString()
  JWT_TOKEN_SECRET!: string;

  @IsString()
  JWT_TOKEN_EXPIRATION_TIME!: string;

  @IsString()
  JWT_REFRESH_TOKEN_SECRET!: string;

  @IsString()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME!: string;
}

export default registerAs<JwtConfig>('jwt', () => {
  Logger.debug('validate JWT config');
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    secret: process.env.JWT_TOKEN_SECRET!,
    expirationTime: process.env.JWT_TOKEN_EXPIRATION_TIME!,
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET!,
    refreshExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME!,
  };
});
