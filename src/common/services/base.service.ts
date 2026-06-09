import { UserAccount } from '@/modules/user-account/entities/user-account.entity';

export abstract class BaseService<
  TEntity,
  TCreateDto,
  TUpdateDto,
  TFindOneArgs,
> {
  abstract create(dto: TCreateDto, currentUser: UserAccount): Promise<TEntity>;

  abstract update(
    id: string,
    currentUser: UserAccount,
    dto: TUpdateDto,
  ): Promise<TEntity>;

  abstract remove(id: string | number): Promise<TEntity>;

  abstract findAll(): Promise<TEntity[]>;

  abstract findOne(args: TFindOneArgs): Promise<TEntity | null>;
}
