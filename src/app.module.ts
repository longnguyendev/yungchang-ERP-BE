import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './common/config/database.config';
import graphqlConfig from './common/config/graphql.config';
import prismaConfig from './common/config/prisma.config';
import SeverConfig from './common/config/sever.config';
import { GqlConfigService } from './gql-config.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [SeverConfig, databaseConfig, graphqlConfig, prismaConfig],
      isGlobal: true,
      cache: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
