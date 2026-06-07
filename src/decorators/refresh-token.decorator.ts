import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

interface Context {
  req: Request;
}

export const RefreshToken = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context);
    const token = ctx.getContext<Context>().req?.cookies
      ?.refreshToken as string;
    return token;
  },
);
