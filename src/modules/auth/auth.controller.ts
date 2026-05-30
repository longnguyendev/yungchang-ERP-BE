import { AppConfig } from '@/common/config/app.config';
import { Public, SkipVerify } from '@/decorators';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';

import { AuthService } from './auth.service';

@Public()
@SkipThrottle()
@SkipVerify()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}
}
