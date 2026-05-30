import { ONE_MINUTES } from '@/constants';
import { CurrentUser, Public, SkipVerify, Token } from '@/decorators';
import { JwtRefreshAuthGuard, LocalAuthGuard } from '@/guards';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { type Request } from 'express';

import { CreateUserAccountInput } from '../user-account/dto/create-user-account.input';
import { UserAccount } from '../user-account/entities/user-account.entity';
import { UserToken } from '../user-token/entities/user-token.entity';
import { AuthService } from './auth.service';
import { ChangePasswordInput } from './dto/change-password.dto ';
import { ResetPasswordInput } from './dto/reset-password.dto';
import { SignInInput } from './dto/signIn.dto';
import { VerifyUserInput } from './dto/verify-user.dto';
import { Auth } from './entities/auth.entity';
import { MessageResult } from './entities/resetToken.entity';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @SkipVerify()
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
  @SkipVerify()
  @Mutation(() => Auth)
  signUp(
    @Args('signUpInput') createUserInput: CreateUserAccountInput,
    @Context() context: Request,
  ) {
    return this.authService.signUp(createUserInput, context);
  }

  @Public()
  @SkipVerify()
  @UseGuards(JwtRefreshAuthGuard)
  @Query(() => Auth)
  refreshToken(@CurrentUser() user: UserAccount, @Token() token: string) {
    return this.authService.refreshToken(user, token);
  }

  @SkipVerify()
  @Mutation(() => UserToken, { name: 'signOut' })
  signOut(@Token() token: string, @Context() context: Request) {
    return this.authService.signOut(token, context);
  }

  @SkipVerify()
  @Query(() => UserAccount, { name: 'me' })
  me(@CurrentUser() user: UserAccount, @Token() token: string) {
    return this.authService.me(user, token);
  }

  @Public()
  @SkipVerify()
  @Mutation(() => MessageResult, { name: 'forgotPassword' })
  async forgotPassword(@Args('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @SkipVerify()
  @Mutation(() => MessageResult, { name: 'resetPassword' })
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    return this.authService.resetPassword(resetPasswordInput);
  }

  @Mutation(() => MessageResult, { name: 'changePassword' })
  async changePassword(
    @CurrentUser() user: UserAccount,
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
  ) {
    const { username } = user;
    return this.authService.changePassword({
      username,
      ...changePasswordInput,
    });
  }

  @Throttle({ default: { limit: 10, ttl: ONE_MINUTES } })
  @SkipVerify()
  @Mutation(() => UserAccount, { name: 'verifyUser' })
  verifyUser(
    @CurrentUser() user: UserAccount,
    @Args('verifyUserInput') verifyUserInput: VerifyUserInput,
  ) {
    return this.authService.verifyUser({ user, ...verifyUserInput });
  }

  @Throttle({ default: { limit: 3, ttl: ONE_MINUTES } })
  @SkipVerify()
  @Mutation(() => MessageResult, { name: 'regenerateVerifyCode' })
  async regenerateVerifyCode(@CurrentUser() user: UserAccount) {
    return this.authService.regenerateVerifyCode(user);
  }
}
