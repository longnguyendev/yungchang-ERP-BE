import { userTokenFindUniqueArgs } from '@/generated/prisma/models';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';

import { CreateUserTokenInput } from './dto/create-user-token.input';

@Injectable()
export class UserTokenService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserTokenInput: CreateUserTokenInput) {
    return this.prismaService.userToken.create({
      data: createUserTokenInput,
    });
  }

  findOne(args: userTokenFindUniqueArgs) {
    return this.prismaService.userToken.findUnique({
      ...args,
    });
  }

  update(id: number, updateUserTokenInput: CreateUserTokenInput) {
    return this.prismaService.userToken.update({
      where: { id },
      data: updateUserTokenInput,
    });
  }

  async remove(id: number) {
    return await this.prismaService.userToken.delete({
      where: { id },
    });
  }
}
