import { RedisConfigService } from '@/core/redis/redis-config.service';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { RedisModule } from './redis.module';

@Global()
@Module({
  imports: [
    RedisModule.registerAsync({
      inject: [ConfigService],
      useClass: RedisConfigService,
    }),
  ],
  exports: [RedisModule],
})
export class RedisConfigModule {}
