import { Module } from '@nestjs/common';
import { TagRepository } from './tag.repository';

@Module({
  providers: [TagRepository],
  exports: [TagRepository],
})
export class TagModule {}
