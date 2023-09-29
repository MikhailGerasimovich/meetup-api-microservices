import { ApiProperty } from '@nestjs/swagger';

export type ReportType = 'pdf' | 'csv';
export class Report {
  @ApiProperty({ description: 'Generated report type pdf or csv only', default: 'pdf' })
  type: ReportType;
}
