import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  create(createUserInput: CreateUserInput) {
    return this.prismaService.user.create({
      data: createUserInput,
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  update(updateUserInput: UpdateUserInput) {
    const { id, ...data } = updateUserInput;
    return this.prismaService.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
