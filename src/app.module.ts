import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { InstructorModule } from './instructor/instructor.module';
import { FileModule } from './file/file.module';
import { CourseModule } from './course/course.module';
import { ParticipantModule } from './participant/participant.module';
import { BillModule } from './bill/bill.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    InstructorModule,
    FileModule,
    CourseModule,
    ParticipantModule,
    BillModule,
    DashboardModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
