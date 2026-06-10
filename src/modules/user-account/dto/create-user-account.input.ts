import { I18N_KEYS } from '@/constants/i18n-keys';
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
    message: I18N_KEYS.ERRORS.USER_ACCOUNT.INVALID_PASSWORD,
  })
  password!: string;
}
