import { CreateUserInput } from '@/user/dto/create-user.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Number)
  id!: number;
}
