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
import { ProjectAuth } from 'src/account/entities/projectAuth.entity';
import { Episode } from 'src/database/produce_entity/episode.entity';

import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionFactory } from 'src/common/utils/multer.option';
import { ProjectDetail } from 'src/database/produce_entity/project-detail.entity';
import { EpisodeDetail } from 'src/database/produce_entity/episode-detail.entity';
import { EpisodeExtension } from 'src/database/produce_entity/episode-extension.entity';
import { DiscardResource } from 'src/resource-manager/entities/discard-resource.entity';
import { StandardInfo } from 'src/common/entities/standard-info.entity';
import { Script } from 'src/database/produce_entity/script.entity';

@Module({
  //imports: [DatabaseModule],
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectAuth,
      Episode,
      Script,
      ProjectDetail,
      EpisodeDetail,
      EpisodeExtension,
      DiscardResource,
      StandardInfo,
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
