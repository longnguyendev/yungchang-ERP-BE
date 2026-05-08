import { DatabaseConfig } from '@/common/config/database.config';
import { GraphQLConfig } from '@/common/config/graphql.config';
import { PrismaConfig } from '@/common/config/prisma.config';
import { ServerConfig } from '@/common/config/sever.config';

export interface AppConfig {
  database: DatabaseConfig;
  server: ServerConfig;
  graphql: GraphQLConfig;
  prisma: PrismaConfig;
}
