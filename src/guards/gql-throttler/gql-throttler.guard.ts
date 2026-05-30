import { TooManyRequestsException } from '@/common/exceptions';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { type Request, type Response } from 'express';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext<{ req: Request; res: Response }>();
    return { req: ctx.req, res: ctx.res };
  }

  protected throwThrottlingException(): Promise<void> {
    throw new TooManyRequestsException('Vượt quá giới hạn truy cập!');
  }
}
