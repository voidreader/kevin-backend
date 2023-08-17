import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Account } from './produce_entity/account.entity';
import { Verification } from 'src/account/entities/verification.entity';
import { ProjectAuth } from 'src/account/entities/projectAuth.entity';
import { Project } from './produce_entity/project.entity';
import { ProjectDetail } from './produce_entity/project-detail.entity';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: () => ({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: +process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB_NAME,
    entities: [Account, Verification, ProjectAuth, Project, ProjectDetail],
    synchronize: process.env.NODE_ENV !== 'prod',
    //logging: process.env.NODE_ENV !== 'prod',
    logging: false,
  }),
  inject: [ConfigService],
};
