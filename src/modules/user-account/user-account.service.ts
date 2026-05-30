import { UserAccountFindUniqueArgs } from '@/generated/prisma/models';
import { hashPassword } from '@/helpers';
import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { EmployeeService } from '../employee/employee.service';
import { CreateUserAccountInput } from './dto/create-user-account.input';
import { UpdateUserAccountInput } from './dto/update-user-account.input';

@Injectable()
export class UserAccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly employeeService: EmployeeService,
  ) {}
  async create(createUserAccountInput: CreateUserAccountInput) {
    const { password, ...rest } = createUserAccountInput;

    const employee = await this.employeeService.findOne({
      where: { id: rest.employeeId },
    });
    if (!employee) {
      throw new NotFoundException('Employee with this code does not exist');
    }
    const existingAccount = await this.prismaService.userAccount.findUnique({
      where: { employeeId: rest.employeeId },
    });
    if (existingAccount) {
      throw new NotFoundException(
        'User account for this employee already exists',
      );
    }
    const existingUsername = await this.prismaService.userAccount.findUnique({
      where: { username: rest.username },
    });
    if (existingUsername) {
      throw new NotFoundException('Username already exists');
    }
    const passwordHash = await hashPassword(password);

    return this.prismaService.userAccount.create({
      data: { ...rest, password: passwordHash },
      include: { employee: true },
    });
  }

  findAll(args?: UserAccountFindUniqueArgs) {
    return this.prismaService.userAccount.findMany({
      ...args,
    });
  }

  findOne(args: UserAccountFindUniqueArgs) {
    return this.prismaService.userAccount.findUnique({
      ...args,
      include: { employee: true },
    });
  }

  update(employeeId: string, updateUserAccountInput: UpdateUserAccountInput) {
    return this.prismaService.userAccount.update({
      where: { employeeId },
      data: updateUserAccountInput,
    });
  }

  remove(id: number) {
    return this.prismaService.userAccount.delete({
      where: { id },
    });
  }
}
