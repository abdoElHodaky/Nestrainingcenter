import { Express, Response } from 'express';
import { 
  ApiTags,
  ApiSecurity,
  ApiBearerAuth
} from "@nestjs/swagger";

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveDocumentToStorage } from 'src/helpers/document.storage';
import * as path from 'path';
import * as fs from 'fs';
import { Material } from './entities/material.entity';

@ApiTags("Course")
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }

  @Post('material/:id')
  @UseInterceptors(FileInterceptor('material', saveDocumentToStorage))
  createMaterial(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() material: Express.Multer.File,
  ) {
    return this.courseService.addMaterial(
      id,
      material?.originalname,
      material?.filename,
    );
  }

  @Get('material/:id')
  findMaterials(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findMaterials(id);
  }

  @Delete('material/:id')
  deleteMaterial(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.removeMaterial(id);
  }

  @Get('file/:id')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const material: Material = await this.courseService.findMaterial(id);

    const filename = material.path;

    const fileExtension = path.extname(filename).toLowerCase();

    let contentType = '';
    switch (fileExtension) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.xls':
        contentType = 'application/vnd.ms-excel';
        break;
      case '.xlsx':
        contentType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    res.setHeader('Content-Type', contentType);

    const filePath = path.join(__dirname, '../../uploads/documents', filename);

    res.sendFile(filePath);
  }

  @Get(':courseId/participant')
  findCourseParticipants(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.courseService.getParticipantsForCourse(courseId);
  }

  @Post(':courseId/participant/:participantId')
  async addParticipantToCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('participantId', ParseIntPipe) participantId: number,
  ) {
    return this.courseService.addParticipantToCourse(courseId, participantId);
  }

  @Delete(':courseId/participant/:participantId')
  deleteCourseParticipants(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('participantId', ParseIntPipe) participantId: number,
  ) {
    return this.courseService.removeParticipantFromCourse(
      courseId,
      participantId,
    );
  }
}
