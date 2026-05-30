import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateEmployeeInput {
  @Field()
  id!: string;

  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
