import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

interface Context {
  req: Request;
}

export const Token = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | null => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<Context>().req;
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return token;
  },
);
