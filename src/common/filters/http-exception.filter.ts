import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { InternalServerErrorException } from '../exceptions';

interface GraphqlExceptions {
  response: {
    i18nKey?: string;
    statusCode: HttpStatus;
    params?: Record<string, any>;
  };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: GraphqlExceptions, _host: ArgumentsHost) {
    if (!exception?.response?.i18nKey) {
      console.log(exception);
      throw new InternalServerErrorException();
    }
  }
}
