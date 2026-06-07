import { UnauthorizedException } from '@/common/exceptions';
import { AuthService } from '@/modules/auth/auth.service';
import { UserAccount } from '@/modules/user-account/entities/user-account.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string): Promise<UserAccount> {
    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
