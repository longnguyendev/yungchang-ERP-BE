import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VerifyUserInput {
  @Field()
  code: string;
}
