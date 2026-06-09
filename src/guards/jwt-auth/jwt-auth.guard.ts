import { ForbiddenException, UnauthorizedException } from '@/common/exceptions';
import { IS_PUBLIC_KEY } from '@/decorators';
import { UserAccount } from '@/modules/user-account/entities/user-account.entity';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: { user: UserAccount | undefined } }>().req;
  }

  handleRequest<TUser extends UserAccount = UserAccount>(
    err: any,
    user: TUser | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _info: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _status?: any,
  ): TUser {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.isActive === false) {
      throw new ForbiddenException({ username: user.username });
    }
    return user;
  }
}
