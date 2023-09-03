import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export interface AwsOptions {
  accessKeyId: string;
  secretAccessKey: string;
  Bucket: string;
  debug: boolean;
  route: string;
}

export type AwsAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<AwsOptions>, 'useFactory' | 'inject'>;
