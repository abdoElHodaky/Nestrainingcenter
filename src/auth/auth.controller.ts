import {
  Controller,
  Post,
  Body,
  UploadedFile,
  ValidationPipe,
  UseInterceptors,
  UsePipes,
  Patch,
  Get,
  Param,
  Res,
} from '@nestjs/common';

import { Express, Response } from 'express';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from 'src/helpers/image.storage';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin-dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

import * as path from 'path';
import * as fs from 'fs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UseInterceptors(FileInterceptor('profilePicture', saveImageToStorage))
  signUp(
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body(ValidationPipe) createAdminDto: CreateAdminDto,
  ): Promise<void> {
    return this.authService.signUp(createAdminDto, profilePicture?.filename);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get()
  getUser() {
    return this.authService.find();
  }

  @Get('photo/:id')
  async getProfileImage(@Param('id') id: number, @Res() res: Response) {
    const user: User = await this.authService.find();
    if (user.profilePicture) {
      const imagePath = path.join(
        __dirname,
        '../../uploads/images',
        user.profilePicture,
      );
      const imageBuffer = fs.readFileSync(imagePath);

      res.setHeader('Content-Type', 'image/jpeg');

      res.send(imageBuffer);
    } else {
      res.status(404).send('Profile picture not found');
    }
  }

  @Patch('/update')
  @UseInterceptors(FileInterceptor('profilePicture', saveImageToStorage))
  update(
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body(ValidationPipe) updateAdminDto: UpdateAdminDto,
  ): Promise<void> {
    return this.authService.update(updateAdminDto, profilePicture?.filename);
  }
}
