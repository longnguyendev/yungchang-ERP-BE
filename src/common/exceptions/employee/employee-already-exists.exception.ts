import { HttpStatus } from '@nestjs/common';

import { I18N_KEYS } from '../../../constants/i18n-keys';
import { BaseException } from '../base.exception';

export class EmployeeAlreadyExistsException extends BaseException {
  constructor({ employeeId }: { employeeId: string }) {
    super({
      i18nKey: I18N_KEYS.SERVER_ERRORS.EMPLOYEE.ALREADY_EXISTS,
      statusCode: HttpStatus.CONFLICT,
      params: { employeeId },
    });
  }
}
