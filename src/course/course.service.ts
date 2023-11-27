import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Between, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Material } from './entities/material.entity';
import { FileService } from 'src/file/file.service';
import { Participant } from 'src/participant/entities/participant.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    private fileService: FileService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = new Course();
    course.title = createCourseDto.title;
    course.description = createCourseDto.description;
    course.category = createCourseDto.category;
    course.duration = createCourseDto.duration;
    course.startDate = createCourseDto.startDate;
    course.endDate = createCourseDto.endDate;
    course.maxParticipants = createCourseDto.maxParticipants;
    course.prerequisites = createCourseDto.prerequisites;
    course.registrationFee = createCourseDto.registrationFee;
    course.instructorSalary = createCourseDto.instructorSalary;
    course.instructor = await this.instructorRepository.findOneBy({
      id: createCourseDto.instructorId,
    });

    return await course.save();
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find();
  }

  async findOne(id: number): Promise<Course> {
    return await this.courseRepository.findOneBy({ id });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.findOneBy({ id });
    if (course) {
      course.title = updateCourseDto.title;
      course.description = updateCourseDto.description;
      course.category = updateCourseDto.category;
      course.duration = updateCourseDto.duration;
      course.startDate = updateCourseDto.startDate;
      course.endDate = updateCourseDto.endDate;
      course.maxParticipants = updateCourseDto.maxParticipants;
      course.prerequisites = updateCourseDto.prerequisites;

      course.registrationFee = updateCourseDto.registrationFee;
      course.instructorSalary = updateCourseDto.instructorSalary;
      course.instructor = await this.instructorRepository.findOneBy({
        id: updateCourseDto.instructorId,
      });

      return await course.save();
    } else {
      throw new NotFoundException("course doesn't exist");
    }
  }

  async remove(id: number) {
    const course = await this.courseRepository.findOneBy({ id });
    if (course && typeof course.materials === 'object') {
      const materials: Material[] = Object.values(course.materials);
      for (let material of materials) {
        await this.removeMaterial(material.id);
      }
    }

    return await course.remove();
  }

  async addMaterial(
    id: number,
    title: string,
    path: string,
  ): Promise<Material> {
    const course: Course = await this.courseRepository.findOneBy({ id });
    const material = new Material();
    material.title = title;
    material.path = path;
    material.course = course;
    return await material.save();
  }

  async findMaterial(id: number): Promise<Material> {
    const material: Material = await this.materialRepository.findOneBy({
      id,
    });
    return material;
  }

  async findMaterials(courseId: number): Promise<Material[]> {
    const materials: Material[] = await this.materialRepository.findBy({
      courseId,
    });
    return materials;
  }

  async removeMaterial(id: number): Promise<void> {
    const material: Material = await this.materialRepository.findOneBy({ id });

    if (material) {
      await this.fileService.deleteFile(material.path, 'documents');
      await material.remove();
    }
  }

  async addParticipantToCourse(
    courseId: number,
    participantId: number,
  ): Promise<Participant> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['participants'],
    });

    const participant = await this.participantRepository.findOneBy({
      id: participantId,
    });

    if (!course || !participant) {
      throw new NotFoundException('Course or Participant not found');
    }

    course.participants.push(participant);
    await this.courseRepository.save(course);
    return participant;
  }

  async getParticipantsForCourse(courseId: number): Promise<Participant[]> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['participants'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course.participants;
  }

  async getCoursesWithMostParticipants() {
    const courses = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.participants', 'participant')
      .select([
        'course.id',
        'course.title',
        'course.description',
        'COUNT(participant.id) as participantCount',
      ])
      .groupBy('course.id')
      .orderBy('participantCount', 'DESC')
      .take(6)
      .getRawMany();

    return courses;
  }

  async getCoursesNumberPerCategory(time: number) {
    let coursesNumberPerCategoryPromises: any;
    const categories = [
      'Computer Science',
      'Engineering',
      'Business Administration',
      'Psychology',
      'Biology',
      'Art History',
    ];
    if (categories) {
      if (time === 0) {
        coursesNumberPerCategoryPromises = categories.map(
          async (category: string) => {
            return this.courseRepository.countBy({ category });
          },
        );
      } else {
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - time);
        coursesNumberPerCategoryPromises = categories.map(
          async (category: string) => {
            return this.courseRepository.count({
              where: {
                created_at: Between(monthsAgo, new Date()),
                category,
              },
            });
          },
        );
      }

      return await Promise.all(coursesNumberPerCategoryPromises);
    }
  }

  async removeParticipantFromCourse(
    courseId: number,
    participantId: number,
  ): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['participants'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const participant = await this.participantRepository.findOneBy({
      id: participantId,
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    course.participants = course.participants.filter(
      (p) => p.id !== participantId,
    );

    return this.courseRepository.save(course);
  }
}
