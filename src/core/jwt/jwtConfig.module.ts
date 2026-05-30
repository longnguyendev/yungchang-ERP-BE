import { AppConfig } from '@/common/config/app.config';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        global: true,
        secret: configService.get('jwt.secret', { infer: true }),
        signOptions: {
          expiresIn: configService.get('jwt.expirationTime', {
            infer: true,
          }),
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}
