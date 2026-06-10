import { HttpStatus } from '@nestjs/common';

import { I18N_KEYS } from '../../../constants/i18n-keys';
import { BaseException } from '../base.exception';

export class BadRequestException extends BaseException {
  constructor({
    i18nKey,
    params,
  }: {
    i18nKey: string;
    params?: Record<string, any>;
  }) {
    super({
      i18nKey: i18nKey || I18N_KEYS.ERRORS.SYSTEM.BAD_REQUEST,
      statusCode: HttpStatus.BAD_REQUEST,
      params,
    });
  }
}
