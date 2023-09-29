import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Header,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseReadAllDto, JwtPayloadDto, ROLES, ReadAllResult } from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JoiValidationPipe, JwtAuthGuard, Roles, RolesGuard, UserFromRequest, ImageValidationPipe } from '../../common';
import { getAllUserSchemaOptions } from '../../common';
import { ReadAllUserDto, UploadFileDto } from './dto';
import { ReadAllUserSchema } from './schemas';
import { UserService } from './user.service';
import { UserType } from './types';

@ApiTags('User')
@ApiCookieAuth()
@ApiExtraModels(ReadAllUserDto, BaseReadAllDto, JwtPayloadDto, UserType, UploadFileDto)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(ROLES.USER, ROLES.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', schema: getAllUserSchemaOptions })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async readAll(
    @Query(new JoiValidationPipe(ReadAllUserSchema)) readAllUserDto: ReadAllUserDto,
  ): Promise<ReadAllResult<UserType>> {
    const { pagination, sorting, ...filters } = readAllUserDto;
    const users = await this.userService.readAll({ pagination, sorting, filters });
    return users;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserType })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async readById(@Param('id', ParseIntPipe) id: number): Promise<UserType> {
    const user = await this.userService.readById(id);
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteById(id);
  }

  @Post('avatar/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({ type: UploadFileDto })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async uploadAvatar(
    @UserFromRequest() jwtPayload: JwtPayloadDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ): Promise<void> {
    await this.userService.uploadAvatar(jwtPayload, file);
  }

  @Get('avatar/download/:userId')
  @Header('Content-Type', 'image/jpeg')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Download user avatar by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async downloadAvatar(@Param('userId', ParseIntPipe) id: number, @Res({ passthrough: true }) res: Response): Promise<void> {
    const image = await this.userService.downloadAvatar(id);
    res.send(image.data.Body);
  }

  @Delete('avatar/remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove user avatar' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async removeAvatar(@UserFromRequest() jwtPayload: JwtPayloadDto): Promise<void> {
    await this.userService.removeAvatar(jwtPayload);
  }
}
