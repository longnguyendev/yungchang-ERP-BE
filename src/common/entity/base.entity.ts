import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseEntity {
  @Field(() => Int)
  id!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}
