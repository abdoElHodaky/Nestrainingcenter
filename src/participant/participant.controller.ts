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
  UsePipes,UseGuards
} from '@nestjs/common';
import { Express, Response } from 'express';
import { AuthGuard } from "@nestjs/passport";
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from 'src/helpers/image.storage';
import { Participant } from './entities/participant.entity';

import * as path from 'path';
import * as fs from 'fs';
import { 
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiExcludeEndpoint
} from "@nestjs/swagger";

@ApiBearerAuth('JWTAuth')
@ApiTags("Participant")
@UseGuards(AuthGuard('jwt'))
@Controller('participant')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profilePicture', saveImageToStorage))
  @UsePipes(ValidationPipe)
  create(
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body() createParticipantDto: CreateParticipantDto,
  ) {
    return this.participantService.create(
      createParticipantDto,
      profilePicture?.filename,
    );
  }

  @Get()
  findAll() {
    return this.participantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantService.findOne(+id);
  }

  @Get('photo/:id')
  async getProfileImage(@Param('id') id: number, @Res() res: Response) {
    const participant = await this.participantService.findOne(id);
    if (participant.profilePicture) {
      const imagePath = path.join(
        __dirname,
        '../../uploads/images',
        participant.profilePicture,
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
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    return this.participantService.update(
      id,
      updateParticipantDto,
      profilePicture?.filename,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.participantService.remove(id);
  }
}
