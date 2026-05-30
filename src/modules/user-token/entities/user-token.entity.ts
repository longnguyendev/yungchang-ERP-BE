import { BaseEntity } from '@/common/entities';
import { UserAccount } from '@/modules/user-account/entities/user-account.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserToken extends BaseEntity {
  employeeId!: string;

  refreshToken!: string;

  accessToken!: string;

  expiresAt!: string;

  userAccount!: UserAccount;
}
