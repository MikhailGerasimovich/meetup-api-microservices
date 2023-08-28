import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

type SendMessageOptions = {
  client: ClientProxy;
  metadata: string;
  data: any;
};

export async function sendMessage<T>(sendMessageOptions: SendMessageOptions): Promise<T> {
  const response = await firstValueFrom(
    sendMessageOptions.client.send(sendMessageOptions.metadata, sendMessageOptions.data),
  );
  return response;
}
