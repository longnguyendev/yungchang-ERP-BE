import { validateConfig } from '@/lib';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

export interface PrismaConfig {
  connectionString: string;
}

class PrismaVariables {
  @IsString()
  DATABASE_URL!: string;
}

export default registerAs<PrismaConfig>('prisma', () => {
  Logger.debug('Loading Prisma configuration');
  validateConfig(process.env, PrismaVariables);
  return { connectionString: process.env.DATABASE_URL! };
});
