import { UserAccount } from '@/modules/user-account/entities/user-account.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: keyof UserAccount | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext<{ req: { user: UserAccount | undefined } }>()
      .req.user;

    return data ? user?.[data] : user;
  },
);
