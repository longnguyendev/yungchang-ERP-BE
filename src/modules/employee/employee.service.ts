import { EmployeeAlreadyExistsException } from '@/common/exceptions/employee/employee-already-exists.exception';
import {
  EmployeeFindManyArgs,
  EmployeeFindUniqueArgs,
} from '@/generated/prisma/models';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';

import { UserAccount } from '../user-account/entities/user-account.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';

@Injectable()
export class EmployeeService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    createEmployeeInput: CreateEmployeeInput,
    currentUser: UserAccount,
  ) {
    const employee = await this.prismaService.employee.findUnique({
      where: { id: createEmployeeInput.id },
    });

    if (employee) {
      throw new EmployeeAlreadyExistsException({
        employeeId: createEmployeeInput.id,
      });
    }
    return this.prismaService.employee.create({
      data: {
        ...createEmployeeInput,
        createdBy: currentUser.employeeId,
      },
    });
  }

  findAll(args?: EmployeeFindManyArgs) {
    return this.prismaService.employee.findMany({
      ...args,
    });
  }

  findOne(Args: EmployeeFindUniqueArgs) {
    return this.prismaService.employee.findUnique({
      ...Args,
    });
  }

  update(
    id: string,
    updateEmployeeInput: Omit<UpdateEmployeeInput, 'id'>,
    currentUser?: UserAccount,
  ) {
    return this.prismaService.employee.update({
      where: { id },
      data: {
        ...updateEmployeeInput,
        updatedBy: currentUser?.employeeId,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.employee.delete({
      where: { id },
    });
  }
}
