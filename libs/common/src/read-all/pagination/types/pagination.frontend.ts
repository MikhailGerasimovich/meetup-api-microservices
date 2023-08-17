export class PaginationFrontend {
  totalRecordsNumber: number;
  records: any;

  constructor(totalRecordsNumber: number, records: any) {
    this.totalRecordsNumber = totalRecordsNumber;
    this.records = records;
  }
}
