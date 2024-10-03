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
  url:`${database_url}&connect_timeout=50`,
  cache:{
    type:"redis",
    options:{
      url:`${process.env.CACHE_URL}`,
    },
    duration: 300000
  },
  entities: [Instructor, Course, Material, Participant, Bill, User],
  synchronize: true,
  extra:{
    ssl:true
  }
};
