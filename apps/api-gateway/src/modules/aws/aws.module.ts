import { DynamicModule, Module } from '@nestjs/common';
import { AwsAsyncOptions } from './types';
import { AwsService } from './aws.service';

@Module({})
export class AwsModule {
  static registerAsync(options: AwsAsyncOptions): DynamicModule {
    return {
      module: AwsModule,
      imports: options.imports,
      providers: [
        {
          provide: 'AWS_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject,
        },
        AwsService,
      ],
      exports: [AwsService],
    };
  }
}
