import { Controller, Get } from '@nestjs/common';
import { GatewayMeetupService } from './gateway-meetup.service';

@Controller()
export class GatewayMeetupController {
  constructor(private readonly gatewayMeetupService: GatewayMeetupService) {}
  @Get('/greeting')
  async getHello() {
    return await this.gatewayMeetupService.getHello();
  }

  @Get('/greeting-async')
  async getHelloAsync() {
    return this.gatewayMeetupService.getHelloAsync();
    return 'hello';
  }

  @Get('/publish-event')
  async publishEvent() {
    console.log('hello');

    this.gatewayMeetupService.publishEvent();
  }
}
