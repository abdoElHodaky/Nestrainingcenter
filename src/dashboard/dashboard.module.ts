import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { CourseModule } from 'src/course/course.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { ParticipantModule } from 'src/participant/participant.module';
import { BillModule } from 'src/bill/bill.module';

@Module({
  imports: [CourseModule, InstructorModule, ParticipantModule, BillModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
