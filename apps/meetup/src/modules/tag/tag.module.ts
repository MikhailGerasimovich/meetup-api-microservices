import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';

@Module({
  imports: [DatabaseModule],
  providers: [TagRepository, TagService],
  exports: [TagService],
})
export class TagModule {}
