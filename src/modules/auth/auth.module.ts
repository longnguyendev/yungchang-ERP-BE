import { JwtRefreshStrategy, JwtStrategy, LocalStrategy } from '@/guards';
import { EmailModule } from '@/modules/email/email.module';
import { UserAccountModule } from '@/modules/user-account/user-account.module';
import { UserTokenModule } from '@/modules/user-token/user-token.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [UserAccountModule, PassportModule, UserTokenModule, EmailModule],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
