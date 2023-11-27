import { Course } from 'src/course/entities/course.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email', 'id', 'phoneNumber', 'CIN'])
export class Instructor extends BaseEntity {
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

  @OneToMany(() => Course, (course) => course.instructor, {
    eager: false,
    cascade: true,
  })
  courses: Course[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
