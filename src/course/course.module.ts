import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Material } from './entities/material.entity';
import { FileModule } from 'src/file/file.module';
import { Participant } from 'src/participant/entities/participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Instructor, Material, Participant]),
    FileModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
