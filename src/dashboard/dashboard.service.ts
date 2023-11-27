import { Injectable } from '@nestjs/common';
import { BillService } from 'src/bill/bill.service';
import { CourseService } from 'src/course/course.service';
import { InstructorService } from 'src/instructor/instructor.service';
import { ParticipantService } from 'src/participant/participant.service';

@Injectable()
export class DashboardService {
  constructor(
    private courseService: CourseService,
    private instructorService: InstructorService,
    private billService: BillService,
    private participantService: ParticipantService,
  ) {}

  async dashboardInfo(time: number) {
    const deposits = await this.billService.getBillsSum(time, 'deposit');
    const withdraws = await this.billService.getBillsSum(time, 'withdraw');
    const benefit = deposits - withdraws;
    const participantsNumber =
      await this.participantService.getParticipantsNumber(time);
    const employees =
      await this.participantService.getParticipantsNumberByOccupation(
        time,
        'student',
      );
    const students =
      await this.participantService.getParticipantsNumberByOccupation(
        time,
        'employee',
      );
    const unemployed =
      await this.participantService.getParticipantsNumberByOccupation(
        time,
        'unemployed',
      );

    const majors = await this.participantService.getParticipantsMajors(time);

    const participantsNumberPerMajor =
      await this.participantService.getParticipantsNumberPerMajor(time);

    const instructorsNumberPerEducationalLevel =
      await this.instructorService.getInstructorsNumberPerEducationalLevel(
        time,
      );

    const instructorsNumberPerGender =
      await this.instructorService.getInstructorsNumberPerGender(time);

    const coursesWithMostParticipants =
      await this.courseService.getCoursesWithMostParticipants();

    const categories = [
      'Computer Science',
      'Engineering',
      'Business Administration',
      'Psychology',
      'Biology',
      'Art History',
    ];

    const numberOfCoursesPerCategory =
      await this.courseService.getCoursesNumberPerCategory(time);

    const infos = {
      deposits,
      withdraws,
      benefit,
      participants: {
        participantsNumber,
        employees,
        students,
        unemployed,
        major: {
          majors,
          participantsNumberPerMajor,
        },
      },
      instructors: {
        educationalLevel: {
          educationalLevels: [
            'PhD',
            'Master',
            'Bachelor',
            'Diploma',
            'High School',
          ],
          instructorsNumberPerEducationalLevel,
        },
        gender: {
          genders: ['male', 'female'],
          instructorsNumberPerGender,
        },
      },
      courses: {
        coursesParticipants: {
          coursesWithMostParticipants: coursesWithMostParticipants.map(
            (course) => course.course_title,
          ),
          numberOfCoursesWithMostParticipants: coursesWithMostParticipants.map(
            (course) => +course.participantcount,
          ),
        },
        category: {
          categories,
          numberOfCoursesPerCategory,
        },
      },
    };
    return infos;
  }
}
