import { GraphqlConfigModule } from '@/core/gql/graphql-config.module';
import { JwtConfigModule } from '@/core/jwt/jwtConfig.module';
import { RedisConfigModule } from '@/core/redis/redis-config.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [JwtConfigModule, GraphqlConfigModule, RedisConfigModule],
  exports: [JwtConfigModule, GraphqlConfigModule, RedisConfigModule],
})
export class CoreModule {}
