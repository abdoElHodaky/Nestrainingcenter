import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Bill } from 'src/bill/entities/bill.entity';
import { Course } from 'src/course/entities/course.entity';
import { Material } from 'src/course/entities/material.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Participant } from 'src/participant/entities/participant.entity';
const database_url=process.env.DATABASE_URL
var parse = require('pg-connection-string').parse;

//DATABASE_URL='postgresql://:@/?sslmode=require'
var connectionOptions = parse(`${database_url}`)
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
 // name: connectionOptions.name,
 /* host: "ep-billowing-mud-a1s0uks8.ap-southeast-1.aws.neon.tech",
  //port: connectionOptions.port,
  username: "nestjs-training-center_owner",
  password: "qr4BigjP1WUz",
  database: "nestjs-training-center",*/
  url:`${database_url}&connect_timeout=50`,
  entities: [Instructor, Course, Material, Participant, Bill, User],
  synchronize: true,
  extra:{
    ssl:true
  }
};
