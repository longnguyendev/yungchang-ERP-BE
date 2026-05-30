import { validateConfig } from '@/helpers';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export interface ServerConfig {
  port: number;
  mode: string;
  feHost: string;
}

class ServerVariables {
  @IsNumber()
  @Min(1)
  @Max(65535)
  APP_PORT?: number;

  @IsString()
  NODE_ENV?: string;

  @IsString()
  FE_HOST!: string;
}

export default registerAs<ServerConfig>('server', () => {
  Logger.debug('Loading server configuration');
  validateConfig(process.env, ServerVariables);
  return {
    port: +process.env.APP_PORT!,
    mode: process.env.NODE_ENV!,
    feHost: process.env.FE_HOST!,
  };
});
