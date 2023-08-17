import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { DatabaseModule } from 'src/database/database.module';
import { databaseProviders } from 'src/database/database.providers';
import { DataSource } from 'typeorm';
import { PRODUCE_DATASOURCE } from 'src/common/common.const';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/database/produce_entity/account.entity';
import { Project } from 'src/database/produce_entity/project.entity';

@Module({
  //imports: [DatabaseModule],
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
