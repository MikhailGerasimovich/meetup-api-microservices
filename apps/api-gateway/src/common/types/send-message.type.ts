import { ClientProxy } from '@nestjs/microservices';

export type SendMessageOptions = {
  client: ClientProxy;
  metadata: string;
  data: any;
};
