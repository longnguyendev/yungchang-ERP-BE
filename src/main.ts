import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppConfig } from './common/config/app.config';
import { BadRequestException } from './common/exceptions';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<AppConfig>);
  const feHost = configService.get('server.feHost', { infer: true })!;
  const mode = configService.get('server.mode', { infer: true })!;

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,

      whitelist: true,

      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const constraint = Object.values(firstError.constraints ?? {})[0];
        return new BadRequestException({
          i18nKey: constraint,
          params: {
            property: firstError.property,
          },
        });
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: mode === 'production' ? [feHost] : true,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
