import { Inject, Injectable } from '@nestjs/common';
import Redis, { type RedisOptions } from 'ioredis';

import { MODULE_OPTIONS_TOKEN } from './redis.module-definition';

@Injectable()
export class RedisService extends Redis {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    options: RedisOptions,
  ) {
    super(options);
  }
}
