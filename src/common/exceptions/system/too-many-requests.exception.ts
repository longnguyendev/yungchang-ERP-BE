import { HttpStatus } from '@nestjs/common';

import { I18N_KEYS } from '../../../constants/i18n-keys';
import { BaseException } from '../base.exception';

export class TooManyRequestsException extends BaseException {
  constructor() {
    super({
      i18nKey: I18N_KEYS.SERVER_ERRORS.SYSTEM.TOO_MANY_REQUESTS,
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
    });
  }
}
