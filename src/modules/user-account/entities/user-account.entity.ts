import { BaseEntity } from '@/common/entities';
import { Employee } from '@/modules/employee/entities/employee.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserAccount extends BaseEntity {
  @Field()
  employeeId!: string;

  @Field()
  username!: string;

  @Field(() => String, { nullable: true })
  email!: string | null;

  password!: string;

  @Field()
  isActive!: boolean;

  @Field(() => Employee)
  employee!: Employee;

  @Field(() => Boolean)
  verified!: boolean;
}
