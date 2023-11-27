import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Between, Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/file/file.service';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
    private fileService: FileService,
  ) {}

  async create(
    createInstructorDto: CreateInstructorDto,
    profilePicture: string,
  ): Promise<Instructor> {
    const instructor: Instructor = new Instructor();
    instructor.firstName = createInstructorDto.firstName;
    instructor.lastName = createInstructorDto.lastName;
    instructor.age = createInstructorDto.age;
    instructor.gender = createInstructorDto.gender;
    instructor.city = createInstructorDto.city;
    instructor.address = createInstructorDto.address;
    instructor.CIN = createInstructorDto.CIN;
    instructor.email = createInstructorDto.email;
    instructor.highestEducationLevel =
      createInstructorDto.highestEducationLevel;
    instructor.major = createInstructorDto.major;
    instructor.phoneNumber = createInstructorDto.phoneNumber;
    instructor.profilePicture = profilePicture;
    instructor.educationalInstitution =
      createInstructorDto.educationalInstitution;
    return await instructor.save();
  }

  async findAll() {
    return await this.instructorRepository.find();
  }

  async findOne(id: number) {
    const instructor: Instructor = await this.instructorRepository.findOneBy({
      id,
    });
    return instructor;
  }

  async findAllByMajor(major: string): Promise<Instructor[]> {
    const instructors: Instructor[] = await this.instructorRepository.findBy({
      major,
    });
    if (instructors) {
      return instructors;
    } else {
      throw new NotFoundException('no instructors in this field');
    }
  }

  async getInstructorsNumberPerEducationalLevel(time: number) {
    let instructorsNumberPerEducationalLevelPromises: any;
    const educationalLevels = [
      'PhD',
      'Master',
      'Bachelor',
      'Diploma',
      'High School',
    ];
    if (educationalLevels) {
      if (time === 0) {
        instructorsNumberPerEducationalLevelPromises = educationalLevels.map(
          async (highestEducationLevel: string) => {
            return this.instructorRepository.countBy({ highestEducationLevel });
          },
        );
      } else {
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - time);
        instructorsNumberPerEducationalLevelPromises = educationalLevels.map(
          async (highestEducationLevel: string) => {
            return this.instructorRepository.count({
              where: {
                created_at: Between(monthsAgo, new Date()),
                highestEducationLevel,
              },
            });
          },
        );
      }

      return await Promise.all(instructorsNumberPerEducationalLevelPromises);
    }
  }

  async getInstructorsNumberPerGender(time: number) {
    let instructorsNumberPerGenderPromises: any;
    const genders = ['male', 'female'];

    if (genders) {
      if (time === 0) {
        instructorsNumberPerGenderPromises = genders.map(
          async (gender: string) => {
            return this.instructorRepository.countBy({ gender });
          },
        );
      } else {
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - time);
        instructorsNumberPerGenderPromises = genders.map(
          async (gender: string) => {
            return this.instructorRepository.count({
              where: {
                created_at: Between(monthsAgo, new Date()),
                gender,
              },
            });
          },
        );
      }

      return await Promise.all(instructorsNumberPerGenderPromises);
    }
  }

  async update(
    id: number,
    updateInstructorDto: UpdateInstructorDto,
    profilePicture: string,
  ) {
    const instructor = await this.instructorRepository.findOneBy({ id });
    if (instructor) {
      instructor.firstName = updateInstructorDto.firstName;
      instructor.lastName = updateInstructorDto.lastName;
      instructor.age = updateInstructorDto.age;
      instructor.gender = updateInstructorDto.gender;
      instructor.city = updateInstructorDto.city;
      instructor.address = updateInstructorDto.address;
      instructor.CIN = updateInstructorDto.CIN;
      instructor.email = updateInstructorDto.email;
      instructor.highestEducationLevel =
        updateInstructorDto.highestEducationLevel;
      instructor.major = updateInstructorDto.major;
      instructor.phoneNumber = updateInstructorDto.phoneNumber;

      instructor.educationalInstitution =
        updateInstructorDto.educationalInstitution;
      if (profilePicture) {
        await this.fileService.deleteFile(instructor.profilePicture, 'images');
        instructor.profilePicture = profilePicture;
      }
      return await instructor.save();
    } else {
      throw new NotFoundException(
        'Instructor with id =' + id + ' is not found',
      );
    }
  }

  async remove(id: number): Promise<void> {
    const instructor: Instructor = await this.instructorRepository.findOneBy({
      id,
    });
    if (instructor.profilePicture) {
      await this.fileService.deleteFile(instructor.profilePicture, 'images');
    }
    await instructor.remove();
  }
}
