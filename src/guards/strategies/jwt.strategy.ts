import { AppConfig } from '@/common/config/app.config';
import { Payload } from '@/modules/auth/auth.service';
import { UserAccountService } from '@/modules/user-account/user-account.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly userAccountService: UserAccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret', { infer: true })!,
    });
  }

  async validate({ sub }: Payload) {
    const user = await this.userAccountService.findOne({
      where: { employeeId: sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
