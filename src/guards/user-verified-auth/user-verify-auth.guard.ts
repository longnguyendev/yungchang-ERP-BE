import { IS_SKIP_VERIFIED } from '@/decorators';
import { UserAccount } from '@/modules/user-account/entities/user-account.entity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class VerifyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isSkipVerified = this.reflector.getAllAndOverride<boolean>(
      IS_SKIP_VERIFIED,
      [context.getHandler(), context.getClass()],
    );
    if (isSkipVerified) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<{ req: { user: UserAccount } }>().req;
    const user: UserAccount = req['user'];
    return user.verified;
  }
}
