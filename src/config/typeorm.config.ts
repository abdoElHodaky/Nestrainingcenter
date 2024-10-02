import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Bill } from 'src/bill/entities/bill.entity';
import { Course } from 'src/course/entities/course.entity';
import { Material } from 'src/course/entities/material.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Participant } from 'src/participant/entities/participant.entity';
const database_url="postgresql://nestjs-training-center_owner:qr4BigjP1WUz@ep-billowing-mud-a1s0uks8.ap-southeast-1.aws.neon.tech/nestjs-training-center?sslmode=require"
var parse = require('pg-connection-string').parse;

var connectionOptions = parse(`${database_url}`)
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  name: connectionOptions.name,
  host: connectionOptions.host,
  port: connectionOptions.port,
  username: connectionOptions.username,
  password: connectionOptions.password,
  database: connectionOptions.database,
  entities: [Instructor, Course, Material, Participant, Bill, User],
  synchronize: true,
  extra:{
    ssl:true
  }
};
