import { validateConfig } from '@/lib';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

class DatabaseVariables {
  @IsString()
  POSTGRES_HOST!: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  POSTGRES_PORT!: number;

  @IsString()
  POSTGRES_USER!: string;

  @IsString()
  POSTGRES_PASSWORD!: string;

  @IsString()
  POSTGRES_DB!: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  Logger.debug('Loading database configuration');
  validateConfig(process.env, DatabaseVariables);
  return {
    host: process.env.POSTGRES_HOST!,
    port: +process.env.POSTGRES_PORT!,
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
  };
});
