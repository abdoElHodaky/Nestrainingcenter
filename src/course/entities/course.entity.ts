import { Instructor } from 'src/instructor/entities/instructor.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Material } from './material.entity';
import { Participant } from 'src/participant/entities/participant.entity';

@Entity()
@Unique(['title'])
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  duration: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column()
  maxParticipants: number;

  @Column()
  prerequisites: string;

  @Column()
  registrationFee: number;

  @Column()
  instructorSalary: number;

  @ManyToOne(() => Instructor, (instructor) => instructor.courses, {
    eager: true,
  })
  instructor: Instructor;

  @OneToMany(() => Material, (material) => material.course, {
    eager: true,
  })
  materials: Material[];

  @ManyToMany(() => Participant, (participant) => participant.courses, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  participants: Participant[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
