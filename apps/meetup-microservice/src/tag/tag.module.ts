import { Module } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TagRepository, TagService],
  exports: [TagService],
})
export class TagModule {}
