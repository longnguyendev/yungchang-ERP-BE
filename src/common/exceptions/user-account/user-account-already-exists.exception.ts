import { HttpStatus } from '@nestjs/common';

import { I18N_KEYS } from '../../../constants/i18n-keys';
import { BaseException } from '../base.exception';

export class UserAccountAlreadyExistsException extends BaseException {
  constructor({ username }: { username: string }) {
    super({
      i18nKey: I18N_KEYS.SERVER_ERRORS.USER_ACCOUNT.ALREADY_EXISTS,
      params: { username },
      statusCode: HttpStatus.CONFLICT,
    });
  }
}
