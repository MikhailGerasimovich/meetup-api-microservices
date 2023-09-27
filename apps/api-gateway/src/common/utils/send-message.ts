import { SendMessageOptions } from '../types';

export async function sendMessage<T>(sendMessageOptions: SendMessageOptions): Promise<T> {
  const { client, metadata, data } = sendMessageOptions;
  const response = await client.send(metadata, data).toPromise();
  return response;
}
