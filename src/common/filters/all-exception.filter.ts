import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '../exceptions';
import { BaseException } from '../exceptions/base.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown) {
    // custom exception
    if (exception instanceof BaseException) {
      throw exception;
    }

    // Nest exception
    if (exception instanceof HttpException) {
      switch (exception.getStatus()) {
        case 401:
          throw new UnauthorizedException();

        case 403:
          throw new ForbiddenException();

        default:
          throw new InternalServerErrorException();
      }
    }

    throw new InternalServerErrorException();
  }
}
