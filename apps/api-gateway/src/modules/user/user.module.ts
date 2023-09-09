import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH } from '../../common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AwsModule } from '../aws/aws.module';
import { AwsOptions } from '../aws/types';

const DefineAwsModule = AwsModule.registerAsync({
  useFactory: (configService: ConfigService): AwsOptions => ({
    accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    Bucket: configService.get<string>('AWS_BUCKET_NAME'),
    debug: false,
    route: configService.get<string>('AWS_ROUTE_NAME'),
  }),
  inject: [ConfigService],
});

@Module({
  imports: [ConfigModule, DefineAwsModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
