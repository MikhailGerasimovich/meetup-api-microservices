import { Module } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [DatabaseModule],
  providers: [TagRepository, TagService],
  controllers: [TagController],
  exports: [],
})
export class TagModule {}
