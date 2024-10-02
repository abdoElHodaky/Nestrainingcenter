import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { Express, Response } from 'express';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from '../helpers/image.storage';
import { Instructor } from './entities/instructor.entity';
import * as path from 'path';
import * as fs from 'fs';
import { 
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiExcludeEndpoint
} from "@nestjs/swagger";

@ApiBearerAuth('JWTAuth')
@ApiTags("Instructor")
@UseGuards(AuthGuard('jwt'))
@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profilePicture', saveImageToStorage))
  @UsePipes(ValidationPipe)
  create(
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body() createInstructorDto: CreateInstructorDto,
  ): Promise<Instructor> {
    return this.instructorService.create(
      createInstructorDto,
      profilePicture?.filename,
    );
  }

  @Get()
  findAll() {
    return this.instructorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.instructorService.findOne(id);
  }

  @Get('major/:major')
  findAllByMajor(@Param('major') major: string) {
    return this.instructorService.findAllByMajor(major);
  }

  @Get('photo/:id')
  async getProfileImage(@Param('id') id: number, @Res() res: Response) {
    const instructor = await this.instructorService.findOne(id);
    if (instructor.profilePicture) {
      const imagePath = path.join(
        __dirname,
        '../../uploads/images',
        instructor.profilePicture,
      );
      const imageBuffer = fs.readFileSync(imagePath);

      res.setHeader('Content-Type', 'image/jpeg');

      res.send(imageBuffer);
    } else {
      res.status(404).send('Profile picture not found');
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profilePicture', saveImageToStorage))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return this.instructorService.update(
      id,
      updateInstructorDto,
      profilePicture?.filename,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.instructorService.remove(id);
  }
}
