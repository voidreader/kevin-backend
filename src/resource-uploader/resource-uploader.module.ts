import { Module } from '@nestjs/common';
import { ResourceUploaderService } from './resource-uploader.service';
import { ResourceUploaderController } from './resource-uploader.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionFactory } from 'src/common/utils/multer.option';
import { ResourceManagerService } from 'src/resource-manager/resource-manager.service';
import { ResourceManagerModule } from 'src/resource-manager/resource-manager.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscardResource } from 'src/resource-manager/entities/discard-resource.entity';
import { ImageLocalization } from 'src/resource-manager/entities/image-localization.entity';
import { StoryStaticImage } from 'src/resource-manager/entities/story-static-image.entity';
import { Project } from 'src/database/produce_entity/project.entity';
import { PublicExtension } from 'src/resource-manager/entities/public-extension.entity';
import { Model } from 'src/database/produce_entity/model.entity';
import { ModelSlave } from 'src/database/produce_entity/model-slave.entity';
import { LiveResource } from 'src/resource-manager/entities/live-resource.entity';
import { LiveResourceDetail } from 'src/resource-manager/entities/live-resource-detail.entity';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      DiscardResource,
      ImageLocalization,
      StoryStaticImage,
      Project,
      PublicExtension,
      Model,
      ModelSlave,
      LiveResource,
      LiveResourceDetail,
    ]),
  ],

  providers: [ResourceUploaderService, ResourceManagerService],
  controllers: [ResourceUploaderController],
})
export class ResourceUploaderModule {}
