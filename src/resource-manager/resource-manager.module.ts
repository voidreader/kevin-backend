import { Module } from '@nestjs/common';
import { ResourceManagerService } from './resource-manager.service';
import { ResourceManagerController } from './resource-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscardResource } from './entities/discard-resource.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionFactory } from 'src/common/utils/multer.option';
import { ImageLocalization } from './entities/image-localization.entity';
import { StoryStaticImage } from './entities/story-static-image.entity';
import { Project } from 'src/database/produce_entity/project.entity';
import { PublicExtension } from './entities/public-extension.entity';
import { Model } from 'src/database/produce_entity/model.entity';
import { ModelSlave } from 'src/database/produce_entity/model-slave.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiscardResource,
      ImageLocalization,
      StoryStaticImage,
      Project,
      PublicExtension,
      Model,
      ModelSlave,
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [ResourceManagerController],
  providers: [ResourceManagerService],
  exports: [ResourceManagerService],
})
export class ResourceManagerModule {}
