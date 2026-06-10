import { CurrentUser } from '@/decorators/user.decorator';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserAccount } from '../user-account/entities/user-account.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  @Mutation(() => Employee)
  createEmployee(
    @Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput,
    @CurrentUser() currentUser: UserAccount,
  ) {
    return this.employeeService.create(createEmployeeInput, currentUser);
  }

  @Query(() => [Employee], { name: 'employees' })
  findAll(
    @Args('take', { type: () => Int, nullable: true, defaultValue: 50 })
    take: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
  ) {
    return this.employeeService.findAll({ take, skip });
  }

  @Query(() => Employee, { name: 'employee' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.employeeService.findOne({ where: { id } });
  }

  @Mutation(() => Employee)
  updateEmployee(
    @Args('updateEmployeeInput') updateEmployeeInput: UpdateEmployeeInput,
    @CurrentUser() currentUser: UserAccount,
  ) {
    const { id, ...rest } = updateEmployeeInput;
    return this.employeeService.update(id, rest, currentUser);
  }

  @Mutation(() => Employee)
  removeEmployee(@Args('id') id: string) {
    return this.employeeService.remove(id);
  }
}
