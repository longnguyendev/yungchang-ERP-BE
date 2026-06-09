import { Employee } from '@/modules/employee/entities/employee.entity';
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserAccount {
  @Field(() => Int)
  id!: number;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => String, { nullable: true })
  createdBy?: string | null;

  @Field(() => String, { nullable: true })
  updatedBy?: string | null;

  @Field()
  employeeId!: string;

  @Field()
  username!: string;

  @Field(() => String, { nullable: true })
  email?: string | null;

  password!: string;

  @Field()
  isActive!: boolean;

  @Field(() => Employee)
  employee!: Employee;
}
