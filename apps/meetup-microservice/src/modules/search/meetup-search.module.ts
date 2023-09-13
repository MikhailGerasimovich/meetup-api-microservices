import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MeetupSearchService } from './meetup-search.service';

const DefineElasticsearchModule = ElasticsearchModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    node: configService.get<string>('ELASTICSEARCH_NODE'),
    auth: {
      username: configService.get<string>('ELASTICSEARCH_USERNAME'),
      password: configService.get<string>('ELASTICSEARCH_PASSWORD'),
    },
  }),
  inject: [ConfigService],
});

@Module({
  imports: [DefineElasticsearchModule],
  providers: [MeetupSearchService],
  exports: [MeetupSearchService],
})
export class MeetupSearchModule {}
