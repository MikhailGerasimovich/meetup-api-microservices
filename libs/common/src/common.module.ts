import { Module } from '@nestjs/common';
import { JoiValidationPipe } from './pipes/joi-validation.pipe';

@Module({
  providers: [JoiValidationPipe],
  exports: [JoiValidationPipe],
})
export class CommonModule {}
