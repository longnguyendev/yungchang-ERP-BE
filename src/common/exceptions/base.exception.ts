import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor({
    i18nKey,
    statusCode,
    params,
  }: {
    i18nKey: string;
    statusCode: HttpStatus;
    params?: Record<string, any>;
  }) {
    super(
      {
        i18nKey,
        statusCode,
        params,
      },
      statusCode,
    );
  }
}
