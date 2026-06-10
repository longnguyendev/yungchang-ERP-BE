import { Field, InputType } from '@nestjs/graphql';
import { Matches, MinLength } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field()
  email: string;

  @Field()
  token: string;

  @Field()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  })
  newPassword: string;
}
