import { AppConfig } from '@/common/config/app.config';
import { IBaseExceptionResponse } from '@/common/exceptions/base.exception';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { Response, Request } from 'express';
import depthLimit from 'graphql-depth-limit';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService<AppConfig>) {}
  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig = this.configService.get('graphql', {
      infer: true,
    })!;
    return {
      // schema options
      autoSchemaFile: graphqlConfig.autoSchemaFile,
      sortSchema: graphqlConfig.sortSchema,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      // subscription
      installSubscriptionHandlers: true,
      playground: graphqlConfig.playgroundEnabled,
      validationRules: [depthLimit(10)],
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault()
          : ApolloServerPluginLandingPageLocalDefault(),
      ],
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      formatError: (error) => {
        const originalError = error.extensions?.originalError as
          | IBaseExceptionResponse
          | undefined;

        return {
          ...error,
          extensions: {
            ...error.extensions,
            i18nKey: originalError?.i18nKey,
            statusCode: originalError?.statusCode,
            params: originalError?.params,
          },
        };
      },
    };
  }
}
