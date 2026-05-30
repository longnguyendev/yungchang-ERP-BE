import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserTokenInput {
  @Field()
  employeeId!: string;

  @Field()
  refreshToken!: string;

  @Field()
  accessToken!: string;

  @Field()
  expiresAt!: number;
}
