import databaseConfig from '@/common/config/database.config';
import graphqlConfig from '@/common/config/graphql.config';
import prismaConfig from '@/common/config/prisma.config';
import SeverConfig from '@/common/config/sever.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import emailConfig from './common/config/email.config';
import jwtConfig from './common/config/jwt.config';
import redisConfig from './common/config/redis.config';
import { FIVE_MINUTES } from './constants';
import { CoreModule } from './core/core.module';
import { GqlThrottlerGuard, JwtAuthGuard } from './guards';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { UserAccountModule } from './modules/user-account/user-account.module';
import { UserTokenModule } from './modules/user-token/user-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        SeverConfig,
        databaseConfig,
        graphqlConfig,
        prismaConfig,
        jwtConfig,
        redisConfig,
        emailConfig,
      ],
      isGlobal: true,
      cache: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: FIVE_MINUTES,
        limit: 50,
      },
    ]),
    CoreModule,

    EmployeeModule,
    UserAccountModule,
    UserTokenModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
