import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { CreateUserAccountInput } from './dto/create-user-account.input';
import { UpdateUserAccountInput } from './dto/update-user-account.input';
import { UserAccount } from './entities/user-account.entity';
import { UserAccountService } from './user-account.service';

@Resolver(() => UserAccount)
export class UserAccountResolver {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Mutation(() => UserAccount)
  createUserAccount(
    @Args('createUserAccountInput')
    createUserAccountInput: CreateUserAccountInput,
  ) {
    return this.userAccountService.create(createUserAccountInput);
  }

  @Query(() => [UserAccount], { name: 'userAccount' })
  findAll() {
    return this.userAccountService.findAll();
  }

  @Query(() => UserAccount, { name: 'userAccount' })
  findOneByEmployeeCode(
    @Args('employeeCode', { type: () => String }) employeeId: string,
  ) {
    return this.userAccountService.findOne({
      where: {
        employeeId,
      },
    });
  }

  @Mutation(() => UserAccount)
  updateUserAccount(
    @Args('employeeId', { type: () => String }) employeeId: string,
    @Args('updateUserAccountInput')
    updateUserAccountInput: UpdateUserAccountInput,
  ) {
    return this.userAccountService.update(employeeId, updateUserAccountInput);
  }

  @Mutation(() => UserAccount)
  removeUserAccount(@Args('id', { type: () => Int }) id: number) {
    return this.userAccountService.remove(id);
  }
}
