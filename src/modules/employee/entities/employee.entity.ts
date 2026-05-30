import { UserAccount } from '@/modules/user-account/entities/user-account.entity';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Employee {
  @Field(() => String)
  id!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  deletedAt?: Date | null;

  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => Boolean)
  isActive!: boolean;

  @Field(() => UserAccount, { nullable: true })
  userAccount?: UserAccount;
}
