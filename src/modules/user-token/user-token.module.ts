import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';

import { UserTokenService } from './user-token.service';

@Module({
  providers: [UserTokenService, PrismaService],
  exports: [UserTokenService],
})
export class UserTokenModule {}
