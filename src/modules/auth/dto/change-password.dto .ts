import { Field, InputType } from '@nestjs/graphql';
import { MinLength, Matches } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  oldPassword!: string;

  @Field()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  newPassword!: string;
}
