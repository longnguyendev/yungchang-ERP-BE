import { CurrentUser } from '@/decorators';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

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
    @CurrentUser() currentUser: UserAccount,
  ) {
    return this.userAccountService.create(createUserAccountInput, currentUser);
  }

  @Query(() => [UserAccount], { name: 'userAccounts' })
  findAll(
    @Args('take', { type: () => Int, nullable: true, defaultValue: 50 })
    take: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
  ) {
    return this.userAccountService.findAll({ take, skip });
  }

  @Query(() => UserAccount, { name: 'userAccount' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userAccountService.findOne({
      where: {
        employeeId: id,
      },
    });
  }

  @Mutation(() => UserAccount)
  updateUserAccount(
    @Args('employeeId', { type: () => String }) employeeId: string,
    @CurrentUser() currentUser: UserAccount,
    @Args('updateUserAccountInput')
    updateUserAccountInput: UpdateUserAccountInput,
  ) {
    return this.userAccountService.update(
      employeeId,
      currentUser,
      updateUserAccountInput,
    );
  }

  @Mutation(() => UserAccount)
  removeUserAccount(@Args('id', { type: () => Int }) id: number) {
    return this.userAccountService.remove(id);
  }
}
