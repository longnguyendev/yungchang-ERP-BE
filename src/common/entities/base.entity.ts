import { Field, Int, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class BaseEntity {
  @Field(() => Int)
  id!: number;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => String)
  createdBy!: string;

  @Field(() => String, { nullable: true })
  updatedBy?: string | null;
}
