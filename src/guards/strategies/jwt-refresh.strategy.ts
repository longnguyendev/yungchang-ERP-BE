import { AppConfig } from '@/common/config/app.config';
import { UnauthorizedException } from '@/common/exceptions';
import { Payload } from '@/modules/auth/auth.service';
import { UserAccountService } from '@/modules/user-account/user-account.service';
import { RefreshRequest } from '@/types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly userAccountService: UserAccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RefreshRequest) => {
          const token = request.cookies?.refreshToken;
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.refreshSecret', { infer: true })!,
    });
  }

  async validate({ sub }: Payload) {
    const user = await this.userAccountService.findOne({
      where: { employeeId: sub },
    });
    Logger.log('JwtRefreshStrategy - validate - user: ', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
