import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './entities/participant.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/file/file.service';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    private fileService: FileService,
  ) {}

  async create(
    createParticipantDto: CreateParticipantDto,
    profilePicture: string,
  ): Promise<Participant> {
    const participant: Participant = new Participant();
    participant.firstName = createParticipantDto.firstName;
    participant.lastName = createParticipantDto.lastName;
    participant.age = createParticipantDto.age;
    participant.gender = createParticipantDto.gender;
    participant.city = createParticipantDto.city;
    participant.address = createParticipantDto.address;
    participant.CIN = createParticipantDto.CIN;
    participant.email = createParticipantDto.email;
    participant.highestEducationLevel =
      createParticipantDto.highestEducationLevel;
    participant.major = createParticipantDto.major;
    participant.phoneNumber = createParticipantDto.phoneNumber;
    participant.profilePicture = profilePicture;
    participant.educationalInstitution =
      createParticipantDto.educationalInstitution;
    participant.occupation = createParticipantDto.occupation;
    participant.jobTitle = createParticipantDto.jobTitle;
    participant.companyName = createParticipantDto.companyName;
    participant.employeeDepartment = createParticipantDto.employeeDepartment;
    return await participant.save();
  }

  async findAll() {
    return await this.participantRepository.find();
  }

  async findOne(id: number) {
    const participant: Participant = await this.participantRepository.findOneBy(
      {
        id,
      },
    );
    return participant;
  }

  async getParticipantsNumber(time: number): Promise<number> {
    if (time === 0) {
      return await this.participantRepository.count();
    } else {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - time);

      return await this.participantRepository.countBy({
        created_at: Between(monthsAgo, new Date()),
      });
    }
  }

  async getParticipantsNumberByOccupation(
    time: number,
    occupation: string,
  ): Promise<number> {
    if (time === 0) {
      return await this.participantRepository.countBy({ occupation });
    } else {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - time);

      return await this.participantRepository.countBy({
        occupation,
        created_at: Between(monthsAgo, new Date()),
      });
    }
  }

  async getParticipantsMajors(time: number) {
    let result: any;
    if (time === 0) {
      result = await this.participantRepository.find({
        select: {
          major: true,
        },
        take: 6,
      });
    } else {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - time);

      result = await this.participantRepository.find({
        where: {
          created_at: Between(monthsAgo, new Date()),
        },
        select: {
          major: true,
        },
        take: 6,
      });
    }

    if (result) {
      const majorsSet = new Set(result.map((participant) => participant.major));
      return Array.from(majorsSet);
    }
  }

  async getParticipantsNumberPerMajor(time: number) {
    let participantsNumberPerMajorPromises: any;
    const majors = await this.getParticipantsMajors(time);
    if (majors) {
      if (time === 0) {
        participantsNumberPerMajorPromises = majors.map(async (major) => {
          return this.participantRepository.countBy(major);
        });
      } else {
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - time);
        participantsNumberPerMajorPromises = majors.map(
          async (major: string) => {
            return this.participantRepository.count({
              where: {
                created_at: Between(monthsAgo, new Date()),
                major,
              },
            });
          },
        );
      }

      return await Promise.all(participantsNumberPerMajorPromises);
    }
  }

  async update(
    id: number,
    updateParticipantDto: UpdateParticipantDto,
    profilePicture: string,
  ): Promise<Participant> {
    const participant: Participant = await this.participantRepository.findOneBy(
      { id },
    );
    if (participant) {
      participant.firstName = updateParticipantDto.firstName;
      participant.lastName = updateParticipantDto.lastName;
      participant.age = updateParticipantDto.age;
      participant.gender = updateParticipantDto.gender;
      participant.city = updateParticipantDto.city;
      participant.address = updateParticipantDto.address;
      participant.CIN = updateParticipantDto.CIN;
      participant.email = updateParticipantDto.email;
      participant.highestEducationLevel =
        updateParticipantDto.highestEducationLevel;
      participant.major = updateParticipantDto.major;
      participant.phoneNumber = updateParticipantDto.phoneNumber;
      participant.educationalInstitution =
        updateParticipantDto.educationalInstitution;
      participant.occupation = updateParticipantDto.occupation;
      participant.jobTitle = updateParticipantDto.jobTitle;
      participant.companyName = updateParticipantDto.companyName;
      participant.employeeDepartment = updateParticipantDto.employeeDepartment;
      if (profilePicture) {
        await this.fileService.deleteFile(participant.profilePicture, 'images');
        participant.profilePicture = profilePicture;
      }
      return await participant.save();
    } else {
      throw new NotFoundException(
        'Participant with id =' + id + ' is not found',
      );
    }
  }

  async remove(id: number): Promise<void> {
    const participant: Participant = await this.participantRepository.findOneBy(
      {
        id,
      },
    );
    if (participant.profilePicture) {
      await this.fileService.deleteFile(participant.profilePicture, 'images');
      console.log('wa zied');
    }
    await participant.remove();
  }
}
