import { HttpStatus } from '@nestjs/common';

import { I18N_KEYS } from '../../../constants/i18n-keys';
import { BaseException } from '../base.exception';

export class InternalServerErrorException extends BaseException {
  constructor() {
    super({
      i18nKey: I18N_KEYS.ERRORS.SYSTEM.INTERNAL_SERVER_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
