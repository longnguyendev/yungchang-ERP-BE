import { BaseEntity } from '@/common/entity/base.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User extends BaseEntity {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;
}
