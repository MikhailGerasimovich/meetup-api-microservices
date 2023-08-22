import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('registration')
  async registration() {}

  @Post('login')
  async login() {}

  @Post('refresh')
  async refresh() {}
}
