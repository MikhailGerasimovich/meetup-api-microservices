import { ArgumentMetadata, Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const maxImageSize = 1024 * 1024 * 10;
    const permissibleMimeType = 'image/jpeg';

    if (value.size > maxImageSize) {
      throw new UnprocessableEntityException('Maximum file transfer size exceeded');
    }

    if (value.mimetype != permissibleMimeType) {
      throw new UnprocessableEntityException('Invalid mime-type');
    }

    return value;
  }
}
