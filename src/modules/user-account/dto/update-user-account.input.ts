import { InputType, PartialType } from '@nestjs/graphql';

import { CreateUserAccountInput } from './create-user-account.input';

@InputType()
export class UpdateUserAccountInput extends PartialType(
  CreateUserAccountInput,
) {
  verified?: boolean;
}
