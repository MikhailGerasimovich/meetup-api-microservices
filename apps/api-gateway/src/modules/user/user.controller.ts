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
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtPayloadDto, ROLES, ReadAllResult } from '@app/common';
import { JoiValidationPipe, JwtAuthGuard, Roles, RolesGuard, UserFromRequest } from '../../common';
import { ReadAllUserSchema } from './schemas';
import { UserService } from './user.service';
import { ReadAllUserDto } from './dto';
import { UserType } from './types';
import { ImageValidationPipe } from '../../common/pipes/image-validation.pipe';

// @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Post('avatar/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  async uploadAvatar(
    @UserFromRequest() jwtPayload: JwtPayloadDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ): Promise<void> {
    await this.userService.uploadAvatar(jwtPayload, image);
  }

  @Get('avatar/download/:userId')
  @Header('Content-Type', 'image/jpeg')
  @HttpCode(HttpStatus.OK)
  async downloadAvatar(
    @UserFromRequest() jwtPayload: JwtPayloadDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const image = await this.userService.downloadAvatar(jwtPayload);
    res.send(image.data.Body);
  }

  @Delete('avatar/remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAvatar(@UserFromRequest() jwtPayload: JwtPayloadDto): Promise<void> {
    await this.userService.removeAvatar(jwtPayload);
  }
}
