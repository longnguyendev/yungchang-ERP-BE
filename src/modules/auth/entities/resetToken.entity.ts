import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageResult {
  @Field()
  message: string;
}
