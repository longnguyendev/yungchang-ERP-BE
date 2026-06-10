import { HttpStatus } from '@nestjs/common';

import { I18N_KEYS } from '../../../constants/i18n-keys';
import { BaseException } from '../base.exception';

export class ForbiddenException extends BaseException {
  constructor(params?: { username?: string }) {
    super({
      i18nKey: I18N_KEYS.ERRORS.SYSTEM.FORBIDDEN,
      statusCode: HttpStatus.FORBIDDEN,
      params,
    });
  }
}
