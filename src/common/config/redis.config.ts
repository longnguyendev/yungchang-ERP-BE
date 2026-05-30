import { validateConfig } from '@/helpers';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export interface RedisConfig {
  host: string;
  port: number;
}

class EnvironmentVariablesValidator {
  @IsString()
  REDIS_HOST!: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  REDIS_PORT!: number;
}

export default registerAs<RedisConfig>('redis', () => {
  Logger.debug('validate Redis config');
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    host: process.env.REDIS_HOST!,
    port: +process.env.REDIS_PORT!,
  };
});
