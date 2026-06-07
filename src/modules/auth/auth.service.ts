import { AppConfig } from '@/common/config/app.config';
import { UnauthorizedException } from '@/common/exceptions';
import { SALT_OR_ROUNDS } from '@/constants';
import { generateSecureOTP } from '@/helpers';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Request } from 'express';
import ms, { StringValue } from 'ms';

import { RedisService } from '../../core/redis/redis.service';
import { EmailService } from '../email/email.service';
import { CreateUserAccountInput } from '../user-account/dto/create-user-account.input';
import { UserAccount } from '../user-account/entities/user-account.entity';
import { UserAccountService } from '../user-account/user-account.service';
import { UserTokenService } from '../user-token/user-token.service';
import { ChangePasswordInput } from './dto/change-password.dto ';
import { ResetPasswordInput } from './dto/reset-password.dto';
import { SignInInput } from './dto/signIn.dto';
import { VerifyUserInput } from './dto/verify-user.dto';
import { Auth } from './entities/auth.entity';

export interface Payload {
  sub: string;
}

export interface JwtPayload extends Payload {
  iat: string;
  exp: string;
}

export const aliasResetPassword = 'reset-password';

export const aliasVerifyUser = 'verify-user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userAccountService: UserAccountService,
    private readonly jwtService: JwtService,
    private readonly userTokenService: UserTokenService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

  generateAccessToken(payload: Payload) {
    return this.jwtService.signAsync(payload);
  }

  generateRefreshToken(payload: Payload) {
    const expiresIn = this.configService.get('jwt.refreshExpirationTime', {
      infer: true,
    }) as StringValue;
    return this.jwtService.signAsync(payload, {
      expiresIn,
      secret: this.configService.get('jwt.refreshSecret', { infer: true }),
    });
  }

  generateResetToken(): string {
    const token = randomBytes(32).toString('hex');
    return token;
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, SALT_OR_ROUNDS);
  }

  async validateUser(signInInput: SignInInput): Promise<UserAccount | null> {
    const { password, username } = signInInput;
    const user = await this.userAccountService.findOne({
      where: { username },
    });
    if (user) {
      const match = await this.isMatch(password, user.password ?? '');
      if (match) {
        return user;
      }
    }
    return null;
  }

  async validateGoogleUser(
    googleUser: CreateUserAccountInput,
  ): Promise<UserAccount> {
    const { email } = googleUser;
    const user = await this.userAccountService.findOne({
      where: { email },
    });
    if (user) {
      return user;
    }
    return await this.userAccountService.create({
      ...googleUser,
      email,
    });
  }

  async isMatch(attempt: string, password: string): Promise<boolean> {
    return bcrypt.compare(attempt, password);
  }

  async signIn(user: UserAccount, context: Request): Promise<Auth> {
    const { employeeId } = user;
    const payload: Payload = {
      sub: employeeId,
    };
    const expiresIn = this.configService.get('jwt.refreshExpirationTime', {
      infer: true,
    }) as StringValue;
    const mode = this.configService.get('server.mode', { infer: true });
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    const jwtDecoded = this.jwtService.decode<JwtPayload>(accessToken);
    await this.userTokenService.create({
      employeeId: user.employeeId,
      expiresAt: +jwtDecoded.iat,
      refreshToken,
      accessToken,
    });

    context.res?.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: mode === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + ms(expiresIn)),
    });
    return {
      accessToken,
    };
  }

  async signUp(
    createUserDto: CreateUserAccountInput,
    context: Request,
  ): Promise<Auth> {
    const { username } = createUserDto;
    const user = await this.userAccountService.findOne({
      where: { username },
    });
    if (user) {
      throw new ConflictException('User Already Exists!');
    }
    const newUser = await this.userAccountService.create(createUserDto);
    return this.signIn(newUser, context);
  }

  async refreshToken(user: UserAccount, token: string): Promise<Auth> {
    const payload: Payload = {
      sub: user.employeeId,
    };

    const userToken = await this.userTokenService.findOne({
      where: {
        refreshToken: token,
      },
    });
    if (!userToken) {
      throw new UnauthorizedException();
    }
    const accessToken = await this.generateAccessToken(payload);
    userToken.accessToken = accessToken;
    const userTokenUpdate = await this.userTokenService.update(
      userToken.id,
      userToken,
    );
    if (!userTokenUpdate) {
      throw new HttpException('Sever error', HttpStatus.BAD_REQUEST);
    }
    return { accessToken: accessToken };
  }

  async signOut(token: string, context: Request) {
    const userToken = await this.userTokenService.findOne({
      where: {
        accessToken: token,
      },
    });
    if (!userToken) {
      throw new UnauthorizedException();
    }
    context.res!.clearCookie('refreshToken');
    return await this.userTokenService.remove(userToken.id);
  }

  async me(user: UserAccount, token: string): Promise<UserAccount> {
    const userToken = await this.userTokenService.findOne({
      where: {
        accessToken: token,
      },
    });
    if (!userToken) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async saveResetToken(userId: number, token: string) {
    const hashedToken = await bcrypt.hash(token, SALT_OR_ROUNDS);
    const key = `${aliasResetPassword}:${userId}`;
    await this.redisService.set(key, hashedToken, 'EX', 600);
  }

  async validateResetToken(userId: number, token: string): Promise<boolean> {
    const key = `${aliasResetPassword}:${userId}`;
    const redisToken = await this.redisService.get(key);
    if (!redisToken) return false;
    return this.isMatch(token, redisToken);
  }

  async validateVerifyCode(employeeId: string, code: string): Promise<boolean> {
    const key = `${aliasVerifyUser}:${employeeId}`;
    const redisToken = await this.redisService.get(key);
    if (!redisToken) return false;
    return this.isMatch(code, redisToken);
  }

  async forgotPassword(email: string) {
    const user = await this.userAccountService.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('Email không tồn tại trong hệ thống!');
    }
    const resetToken = this.generateResetToken();
    await Promise.all([
      this.saveResetToken(user.id, resetToken),
      this.emailService.sendResetPasswordEmail(email, resetToken),
    ]);
    return { message: 'Email đặt lại mật khẩu đã được gửi!' };
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput) {
    const { newPassword, token, email } = resetPasswordInput;
    const user = await this.userAccountService.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('Email không tồn tại trong hệ thống!');
    }
    const validate = await this.validateResetToken(user.id, token);
    if (!validate) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn!');
    }
    const hashedPassword = await this.hashPassword(newPassword);
    const { employeeId } = user;
    const key = `${aliasResetPassword}:${employeeId}`;
    await Promise.all([
      this.userAccountService.update(employeeId, {
        password: hashedPassword,
      }),
      this.redisService.del(key),
    ]);

    return { message: 'Mật khẩu đã được đặt lại thành công!' };
  }

  async changePassword(
    changePasswordInput: ChangePasswordInput & {
      username: string;
    },
  ) {
    const { username, newPassword, oldPassword } = changePasswordInput;
    const user = await this.validateUser({
      username,
      password: oldPassword,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const hashedPassword = await this.hashPassword(newPassword);
    const { employeeId } = user;
    await this.userAccountService.update(employeeId, {
      password: hashedPassword,
    });
    return { message: 'Mật khẩu đã được đổi thành công!' };
  }

  async verifyUser(
    verifyUserInput: VerifyUserInput & {
      user: UserAccount;
    },
  ) {
    const {
      code,
      user: { employeeId: id },
    } = verifyUserInput;

    const validate = await this.validateVerifyCode(id, code);
    if (!validate) {
      throw new BadRequestException('Code không hợp lệ hoặc đã hết hạn!');
    }
    const key = `${aliasVerifyUser}:${id}`;
    await this.redisService.del(key);
    return this.userAccountService.update(id, {
      verified: true,
    });
  }

  async regenerateVerifyCode(user: UserAccount) {
    const { employeeId, username } = user;
    const key = `${aliasVerifyUser}:${employeeId}`;
    const OTP = generateSecureOTP(6);
    const hashedOTP = await bcrypt.hash(OTP, SALT_OR_ROUNDS);
    await this.redisService.set(key, hashedOTP, 'EX', 180);

    await this.emailService.sendVerifyUserEmail(username, OTP);

    return {
      message: 'OTP xác thực đã được gởi đến quản trị viên!',
    };
  }
}
