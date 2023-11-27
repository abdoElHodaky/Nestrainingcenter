import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from 'src/course/entities/course.entity';

@Entity()
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: string;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column()
  CIN: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  highestEducationLevel: string;

  @Column()
  educationalInstitution: string;

  @Column()
  major: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column()
  occupation: string;

  @Column({ nullable: true })
  jobTitle?: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  employeeDepartment?: string;

  @ManyToMany(() => Course, (course) => course.participants, {
    onDelete: 'CASCADE',
  })
  courses: Course[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
