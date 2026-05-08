import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsNumber, Max, Min } from 'class-validator';

import { validateConfig } from '../../lib';

export interface ServerConfig {
  port: number;
}

class ServerVariables {
  @IsNumber()
  @Min(1)
  @Max(65535)
  APP_PORT?: number;
}

export default registerAs<ServerConfig>('server', () => {
  Logger.debug('Loading server configuration');
  validateConfig(process.env, ServerVariables);
  return {
    port: +process.env.APP_PORT!,
  };
});
