import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GatewayMeetupService {
  constructor(@Inject('GATEWAY_MEETUP_SERVICE') private readonly client: ClientProxy) {}

  async getHello() {
    return await this.client.send('GET_MEETUPS', 'get meeetups');
  }

  async getHelloAsync() {
    const message = await this.client.send({ cmd: 'greeting-async' }, 'Progressive Coder');
    return message;
  }

  async publishEvent() {
    this.client.emit('book-created', { bookName: 'The Way Of Kings', author: 'Brandon Sanderson' });
  }
}
