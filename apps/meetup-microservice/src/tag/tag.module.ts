import { Module } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';

@Module({
  providers: [TagRepository, TagService],
  exports: [TagRepository, TagService],
})
export class TagModule {}
