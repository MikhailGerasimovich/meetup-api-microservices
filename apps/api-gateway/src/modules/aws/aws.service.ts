import { Inject, Injectable } from '@nestjs/common';
import EasyYandexS3 from 'easy-yandex-s3';
import { AwsOptions } from './types';

@Injectable()
export class AwsService {
  private readonly s3: EasyYandexS3;
  private readonly route: string;

  constructor(@Inject('AWS_OPTIONS') private readonly awsOptions: AwsOptions) {
    this.s3 = new EasyYandexS3({
      auth: {
        accessKeyId: this.awsOptions.accessKeyId,
        secretAccessKey: this.awsOptions.secretAccessKey,
      },
      Bucket: this.awsOptions.Bucket,
      debug: this.awsOptions.debug,
    });
    this.route = this.awsOptions.route;
  }
}
