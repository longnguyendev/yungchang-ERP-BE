import { registerAs } from '@nestjs/config';

export interface GraphQLConfig {
  autoSchemaFile: boolean;
  sortSchema: boolean;
  playgroundEnabled: boolean;
}

export default registerAs<GraphQLConfig>('graphql', () => {
  return {
    autoSchemaFile: true,
    sortSchema: true,
    playgroundEnabled: false,
  };
});
