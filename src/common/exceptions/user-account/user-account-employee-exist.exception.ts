import { HttpStatus } from '@nestjs/common';

import { I18N_KEYS } from '../../../constants/i18n-keys';
import { BaseException } from '../base.exception';

export class UserAccountEmployeeExistsException extends BaseException {
  constructor({ employeeId }: { employeeId: string }) {
    super({
      i18nKey:
        I18N_KEYS.SERVER_ERRORS.USER_ACCOUNT.USER_ACCOUNT_EMPLOYEE_EXISTS,
      params: { employeeId },
      statusCode: HttpStatus.CONFLICT,
    });
  }
}
