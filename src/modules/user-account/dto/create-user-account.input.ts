import { Field, InputType } from '@nestjs/graphql';
import { Matches, MinLength } from 'class-validator';

@InputType()
export class CreateUserAccountInput {
  @Field()
  employeeId!: string;

  @Field()
  username!: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password!: string;
}
