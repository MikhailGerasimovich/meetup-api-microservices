import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import EasyYandexS3 from 'easy-yandex-s3';
import { DownloadedFile } from 'easy-yandex-s3/types/EasyYandexS3';
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

  async upload(file: Express.Multer.File, filename: string): Promise<boolean> {
    const awsResponse = await this.s3.Upload(
      {
        buffer: file.buffer,
        name: filename,
      },
      this.route,
    );
    return Boolean(awsResponse);
  }

  async download(folder: string, filename: string): Promise<false | DownloadedFile> {
    const file = await this.s3.Download(`${folder}/${filename}`);
    return file;
  }

  async remove(folder: string, filename: string): Promise<boolean> {
    const isRemoved = await this.s3.Remove(`${folder}/${filename}`);
    if (typeof isRemoved == 'boolean') {
      return isRemoved;
    }

    throw new InternalServerErrorException(`An error occurred while trying to delete the file ${filename}`);
  }
}
