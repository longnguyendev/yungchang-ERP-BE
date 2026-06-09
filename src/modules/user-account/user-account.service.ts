import {
  EmployeeNotFoundException,
  UserAccountAlreadyExistsException,
  UserAccountEmployeeExistsException,
} from '@/common/exceptions';
import { UserAccountFindUniqueArgs } from '@/generated/prisma/models';
import { hashPassword } from '@/helpers';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';

import { EmployeeService } from '../employee/employee.service';
import { CreateUserAccountInput } from './dto/create-user-account.input';
import { UpdateUserAccountInput } from './dto/update-user-account.input';
import { UserAccount } from './entities/user-account.entity';

@Injectable()
export class UserAccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly employeeService: EmployeeService,
  ) {}

  async create(dto: CreateUserAccountInput, currentUser?: UserAccount) {
    const { password, ...rest } = dto;

    const employee = await this.employeeService.findOne({
      where: { id: rest.employeeId },
    });
    if (!employee) {
      throw new EmployeeNotFoundException({ employeeId: rest.employeeId });
    }
    const existingAccount = await this.prismaService.userAccount.findUnique({
      where: { employeeId: rest.employeeId },
    });
    if (existingAccount) {
      throw new UserAccountEmployeeExistsException({
        employeeId: rest.employeeId,
      });
    }
    const existingUsername = await this.prismaService.userAccount.findUnique({
      where: { username: rest.username },
    });
    if (existingUsername) {
      throw new UserAccountAlreadyExistsException({
        username: rest.username,
      });
    }
    const passwordHash = await hashPassword(password);

    return this.prismaService.userAccount.create({
      data: {
        ...rest,
        password: passwordHash,
        createdBy: currentUser?.employeeId,
        verified: true,
      },
      include: { employee: true },
    });
  }

  findAll(args?: UserAccountFindUniqueArgs) {
    return this.prismaService.userAccount.findMany({
      ...args,
      include: {
        employee: true,
      },
    });
  }

  findOne(args: UserAccountFindUniqueArgs) {
    return this.prismaService.userAccount.findUnique({
      ...args,
      include: { employee: true },
    });
  }

  update(
    employeeId: string,
    currentUser: UserAccount,
    updateUserAccountInput: UpdateUserAccountInput,
  ) {
    return this.prismaService.userAccount.update({
      where: { employeeId },
      data: { ...updateUserAccountInput, createdBy: currentUser.employeeId },
      include: { employee: true },
    });
  }

  remove(id: number) {
    return this.prismaService.userAccount.delete({
      where: { id },
      include: { employee: true },
    });
  }
}
