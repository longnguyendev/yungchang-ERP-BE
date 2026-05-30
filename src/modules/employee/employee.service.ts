import {
  EmployeeFindManyArgs,
  EmployeeFindUniqueArgs,
} from '@/generated/prisma/models';
import { PrismaService } from '@/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';

import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';

@Injectable()
export class EmployeeService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createEmployeeInput: CreateEmployeeInput) {
    const employee = await this.prismaService.employee.findUnique({
      where: { id: createEmployeeInput.id },
    });

    if (employee) {
      throw new ConflictException('Employee with this id already exists');
    }
    return this.prismaService.employee.create({
      data: createEmployeeInput,
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

  update(id: string, updateEmployeeInput: Omit<UpdateEmployeeInput, 'id'>) {
    return this.prismaService.employee.update({
      where: { id },
      data: updateEmployeeInput,
    });
  }

  remove(id: string) {
    return this.prismaService.employee.delete({
      where: { id },
    });
  }
}
