import { Field, Int, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class BaseEntity {
  @Field(() => Int)
  id!: number;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  deletedAt?: Date | null;
}
