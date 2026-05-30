import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  email: string;

  @Field()
  token: string;

  @Field()
  newPassword: string;
}
