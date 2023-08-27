import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JoiValidationPipe, JwtAuthGuard, Roles, RolesGuard } from '../../common';
import { ReadAllUserSchema } from './schemas';
import { ReadAllUserDto } from './dto';
import { ROLES, ReadAllResult } from '@app/common';
import { UserType } from './types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(ROLES.USER)
  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(
    @Query(new JoiValidationPipe(ReadAllUserSchema)) readAllUserDto: ReadAllUserDto,
  ): Promise<ReadAllResult<UserType>> {
    const { pagination, sorting, ...filters } = readAllUserDto;
    const users = await this.userService.readAll({ pagination, sorting, filters });
    return users;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id', ParseIntPipe) id: number): Promise<UserType> {
    const user = await this.userService.readById(id);
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteById(id);
  }
}
