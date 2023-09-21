import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { stringify } from 'csv-stringify';
import * as ejs from 'ejs';
import * as pdf from 'html-pdf';
import { Response } from 'express';
import { JwtPayloadDto, METADATA, ReadAllResult } from '@app/common';
import { MEETUP, sendMessage } from '../../common';
import { IReadAllMeetupOptions, MeetupSearchResult, MeetupType } from './types';
import { CreateMeetupDto, UpdateMeetupDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MeetupService {
  constructor(
    @Inject(MEETUP.RMQ_CLIENT_NAME) private readonly client: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  async readAll(readAllMeetupOptions: IReadAllMeetupOptions): Promise<ReadAllResult<MeetupType>> {
    const meetups = await sendMessage<ReadAllResult<MeetupType>>({
      client: this.client,
      metadata: METADATA.MP_GET_ALL_MEETUPS,
      data: readAllMeetupOptions,
    });

    return meetups;
  }

  async search(searchText: string): Promise<MeetupSearchResult> {
    const searchResult = await sendMessage<MeetupSearchResult>({
      client: this.client,
      metadata: METADATA.MP_SEARCH,
      data: { searchText },
    });
    return searchResult;
  }

  async generateCsvReport(readAllMeetupOptions: IReadAllMeetupOptions, res: Response): Promise<void> {
    const meetups = await this.readAll(readAllMeetupOptions);
    const outputFileName = this.configService.get<string>('OUTPUT_FILE_NAME_CSV');
    stringify(meetups.records, { header: true, delimiter: ';' }, (err, csvData) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.attachment(outputFileName);
      res.setHeader('Content-Type', 'text/csv');
      res.status(200).send(csvData);
    });
  }

  async generatePdfReport(readAllMeetupOptions: IReadAllMeetupOptions, res: Response): Promise<void> {
    const meetups = await this.readAll(readAllMeetupOptions);
    const templateDir = this.configService.get<string>('TEMPLATE_DIR');
    const templateFile = this.configService.get<string>('TEMPLATE_FILE');
    const template = `${templateDir}/${templateFile}`;
    const outputFileName = this.configService.get<string>('OUTPUT_FILE_NAME_PDF');

    ejs.renderFile(template, { meetups: meetups.records }, async function (err, html) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      pdf.create(html).toBuffer(function (err, buf) {
        if (err) {
          res.status(500).send(err);
          return;
        } else {
          res.attachment(outputFileName);
          res.setHeader('Content-Type', 'text/pdf');
          res.status(200).send(buf);
        }
      });
    });
  }

  async readById(id: number): Promise<MeetupType> {
    const meetup = await sendMessage<MeetupType>({
      client: this.client,
      metadata: METADATA.MP_GET_MEETUP_BY_ID,
      data: { id },
    });

    return meetup;
  }

  async create(createMeetupDto: CreateMeetupDto, organizer: JwtPayloadDto): Promise<MeetupType> {
    const createdMeetup = await sendMessage<MeetupType>({
      client: this.client,
      metadata: METADATA.MP_CREATE_MEETUP,
      data: { createMeetupDto, organizer },
    });

    return createdMeetup;
  }

  async joinToMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupType> {
    const meetup = await sendMessage<MeetupType>({
      client: this.client,
      metadata: METADATA.MP_JOIN_TO_MEETUP,
      data: { meetupId, member },
    });

    return meetup;
  }

  async leaveFromMeetup(meetupId: number, member: JwtPayloadDto): Promise<MeetupType> {
    const meetup = await sendMessage<MeetupType>({
      client: this.client,
      metadata: METADATA.MP_LEAVE_FROM_MEETUP,
      data: { meetupId, member },
    });

    return meetup;
  }

  async update(id: number, updateMeetupDto: UpdateMeetupDto, jwtPayload: JwtPayloadDto): Promise<MeetupType> {
    const updatedTag = await sendMessage<MeetupType>({
      client: this.client,
      metadata: METADATA.MP_UPDATE_MEETUP_BY_ID,
      data: { id, updateMeetupDto, jwtPayload },
    });

    return updatedTag;
  }

  async deleteById(id: number, jwtPayload: JwtPayloadDto): Promise<void> {
    await sendMessage({
      client: this.client,
      metadata: METADATA.MP_DELETE_MEETUP_BY_ID,
      data: { id, jwtPayload },
    });
  }
}
