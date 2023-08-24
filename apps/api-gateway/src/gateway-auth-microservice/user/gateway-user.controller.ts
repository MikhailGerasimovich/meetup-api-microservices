import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { GatewayUserService } from './gateway-user.service';
import { JoiValidationPipe, ReadAllResult } from '@app/common';
import { ReadAllUserSchema } from './schemas/read-all-user.schema';
import { ReadAllUserDto } from './dto/read-all-user.dto';
import { UserFrontend } from './types/user.frontend';

@Controller('user')
export class GatewayUserController {
  constructor(private readonly gatewayUserService: GatewayUserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(
    @Query(new JoiValidationPipe(ReadAllUserSchema)) readAllUserDto: ReadAllUserDto,
  ): Promise<ReadAllResult<UserFrontend>> {
    const { pagination, sorting, ...filters } = readAllUserDto;
    const users = await this.gatewayUserService.readAll({ pagination, sorting, filters });
    return users;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id') id: string): Promise<UserFrontend> {
    const user = await this.gatewayUserService.readById(id);
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.gatewayUserService.deleteById(id);
  }
}
