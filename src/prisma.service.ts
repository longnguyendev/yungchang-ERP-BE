import { AppConfig } from '@/common/config/app.config';
import { PrismaClient } from '@/generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService<AppConfig>) {
    const connectionString = configService.get('prisma.connectionString', {
      infer: true,
    });
    const adapter = new PrismaPg({
      connectionString,
    });
    super({ adapter });
  }
}
