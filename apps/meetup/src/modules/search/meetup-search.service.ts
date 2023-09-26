import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MeetupEntity, MeetupType } from '../meetup/types';
import { MeetupSearchBody, MeetupSearchResult } from './types';

@Injectable()
export class MeetupSearchService implements OnModuleInit {
  private index = 'meetup';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    const isExistIndex = await this.elasticsearchService.indices.exists({ index: this.index });
    if (!isExistIndex) {
      await this.elasticsearchService.indices.create({ index: this.index });
    }
  }

  async create(meetupEntity: MeetupEntity): Promise<void> {
    const meetup = new MeetupType(meetupEntity);
    await this.elasticsearchService.index<MeetupSearchBody>({
      index: this.index,
      document: {
        id: meetup.id,
        title: meetup.title,
        description: meetup.description,
        date: meetup.date,
        place: meetup.place,
        latitude: meetup.latitude,
        longitude: meetup.longitude,
        tags: meetup.tags.map((tag) => ({ id: tag.id, title: tag.title })),
      },
    });
  }

  async search(searchText: string): Promise<MeetupSearchResult> {
    const data = await this.elasticsearchService.search<MeetupSearchBody, MeetupSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: searchText,
            fuzziness: 'auto',
          },
        },
      },
    });

    const result: MeetupSearchResult = {
      hits: {
        total: data.hits.hits.length,
        hits: data.hits.hits.map((hit) => ({ _source: hit._source })),
      },
    };
    return result;
  }

  async update(meetupEntity: MeetupEntity): Promise<void> {
    const meetup = new MeetupType(meetupEntity);
    const document = await this.elasticsearchService.search({
      index: this.index,
      body: {
        query: {
          match: {
            id: meetup.id,
          },
        },
      },
    });
    const documentId = document.hits.hits[0]._id;
    await this.elasticsearchService.update({
      index: this.index,
      id: documentId,
      doc: {
        id: meetup.id,
        title: meetup.title,
        description: meetup.description,
        date: meetup.date,
        place: meetup.place,
        latitude: meetup.latitude,
        longitude: meetup.longitude,
        tags: meetup.tags.map((tag) => ({ id: tag.id, title: tag.title })),
      },
    });
  }

  async delete(meetupId: number): Promise<void> {
    await this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: meetupId,
          },
        },
      },
    });
  }
}
