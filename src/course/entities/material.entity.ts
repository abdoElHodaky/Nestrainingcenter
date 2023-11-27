import { title } from 'process';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Material extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  path: string;

  @ManyToOne(() => Course, (course) => course.materials, {
    eager: false,
  })
  course: Course;

  @Column()
  courseId: number;
}
