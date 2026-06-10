import { ONE_MINUTES } from '@/constants';
import { CurrentUser, Public, RefreshToken, Token } from '@/decorators';
import { JwtRefreshAuthGuard, LocalAuthGuard } from '@/guards';
import { Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { type Request } from 'express';

import { UserAccount } from '../user-account/entities/user-account.entity';
import { UserToken } from '../user-token/entities/user-token.entity';
import { AuthService } from './auth.service';
import { ChangePasswordInput } from './dto/change-password.dto ';
import { ResetPasswordInput } from './dto/reset-password.dto';
import { SignInInput } from './dto/signIn.dto';
import { Auth } from './entities/auth.entity';
import { MessageResult } from './entities/resetToken.entity';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Throttle({ default: { limit: 10, ttl: ONE_MINUTES } })
  @Mutation(() => Auth)
  async signIn(
    @Args('signInInput') _signInInput: SignInInput,
    @CurrentUser() user: UserAccount,
    @Context() context: Request,
  ) {
    return this.authService.signIn(user, context);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Query(() => Auth)
  refreshToken(
    @CurrentUser() user: UserAccount,
    @RefreshToken() token: string,
    @Context() context: Request,
  ) {
    Logger.log('user: ', user);
    Logger.log('token: ', token);

    return this.authService.refreshToken(user, token, context);
  }

  @Mutation(() => UserToken, { name: 'signOut' })
  signOut(@Token() token: string, @Context() context: Request) {
    return this.authService.signOut(token, context);
  }

  @Query(() => UserAccount, { name: 'me' })
  me(@CurrentUser() user: UserAccount, @Token() token: string) {
    return this.authService.me(user, token);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: ONE_MINUTES } })
  @Mutation(() => MessageResult, { name: 'forgotPassword' })
  async forgotPassword(@Args('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Mutation(() => MessageResult, { name: 'resetPassword' })
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
    @CurrentUser() currentUser: UserAccount,
  ) {
    return this.authService.resetPassword(resetPasswordInput, currentUser);
  }

  @Mutation(() => MessageResult, { name: 'changePassword' })
  async changePassword(
    @CurrentUser() currentUser: UserAccount,
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
  ) {
    const { username } = currentUser;
    return this.authService.changePassword(
      {
        username,
        ...changePasswordInput,
      },
      currentUser,
    );
  }

  @Throttle({ default: { limit: 3, ttl: ONE_MINUTES } })
  @Mutation(() => MessageResult, { name: 'regenerateVerifyCode' })
  async regenerateVerifyCode(@CurrentUser() user: UserAccount) {
    return this.authService.regenerateVerifyCode(user);
  }
}
