import { DatabaseConfig } from '@/common/config/database.config';
import { GraphQLConfig } from '@/common/config/graphql.config';
import { PrismaConfig } from '@/common/config/prisma.config';
import { ServerConfig } from '@/common/config/sever.config';

import { EmailConfig } from './email.config';
import { GoogleOauthConfig } from './google-oauth.config';
import { JwtConfig } from './jwt.config';
import { RedisConfig } from './redis.config';

export interface AppConfig {
  database: DatabaseConfig;
  server: ServerConfig;
  graphql: GraphQLConfig;
  prisma: PrismaConfig;
  jwt: JwtConfig;
  redis: RedisConfig;
  email: EmailConfig;
  googleOauth: GoogleOauthConfig;
}
