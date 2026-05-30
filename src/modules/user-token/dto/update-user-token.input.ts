import { InputType, PartialType } from '@nestjs/graphql';

import { CreateUserTokenInput } from './create-user-token.input';

@InputType()
export class UpdateUserTokenInput extends PartialType(CreateUserTokenInput) {}
