import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Bill } from 'src/bill/entities/bill.entity';
import { Course } from 'src/course/entities/course.entity';
import { Material } from 'src/course/entities/material.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Participant } from 'src/participant/entities/participant.entity';
const database_url="postgresql://nestjs-training-center_owner:qr4BigjP1WUz@ep-billowing-mud-a1s0uks8.ap-southeast-1.aws.neon.tech/nestjs-training-center?sslmode=require"
var parse = require('pg-connection-string').parse;

var config = parse('postgres://someuser:somepassword@somehost:381/somedatabase')
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  /*host: 'localhost',
  port: 1919,
  username: 'postgres',
  password: 'admin',
  database: 'horizondata',*/
  entities: [Instructor, Course, Material, Participant, Bill, User],
  synchronize: true,
};
