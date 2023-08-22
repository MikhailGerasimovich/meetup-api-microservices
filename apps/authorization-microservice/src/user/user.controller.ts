import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JoiValidationPipe, ReadAllResult } from '@app/common';
import { ReadAllUserSchema } from './schemas/read-all-user.schema';
import { ReadAllUserDto } from './dto/read-all-user.dto';
import { UserFrontend } from './types/user.frontend';
import { CreateUserSchema } from './schemas/create-user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserSchema } from './schemas/update-user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async readAll(
    @Query(new JoiValidationPipe(ReadAllUserSchema)) readAllUserDto: ReadAllUserDto,
  ): Promise<ReadAllResult<UserFrontend>> {
    const { pagination, sorting, ...filters } = readAllUserDto;
    const users = await this.userService.readAll({ pagination, sorting, filters });
    return {
      totalRecordsNumber: users.totalRecordsNumber,
      records: users.records.map((user) => new UserFrontend(user)),
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id') id: string): Promise<UserFrontend> {
    const user = await this.userService.readById(id);
    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new JoiValidationPipe(CreateUserSchema)) createUserDto: CreateUserDto): Promise<UserFrontend> {
    const createdUser = await this.userService.create(createUserDto);
    return createdUser;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateUserSchema)) updateUserDto: UpdateUserDto,
  ): Promise<UserFrontend> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return updatedUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.userService.deleteById(id);
  }
}
