import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserAccountInput {
  @Field()
  employeeId!: string;

  @Field()
  username!: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  password!: string;
}
