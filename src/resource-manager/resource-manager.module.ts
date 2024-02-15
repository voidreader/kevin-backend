import { Module } from '@nestjs/common';
import { ResourceManagerService } from './resource-manager.service';
import { ResourceManagerController } from './resource-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscardResource } from '../database/produce_entity/discard-resource.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionFactory } from 'src/common/utils/multer.option';
import { ImageLocalization } from '../database/produce_entity/image-localization.entity';
import { StoryStaticImage } from '../database/produce_entity/story-static-image.entity';
import { Project } from 'src/database/produce_entity/project.entity';
import { PublicExtension } from '../database/produce_entity/public-extension.entity';
import { Model } from 'src/database/produce_entity/model.entity';
import { ModelSlave } from 'src/database/produce_entity/model-slave.entity';
import { LiveResource } from '../database/produce_entity/live-resource.entity';
import { LiveResourceDetail } from '../database/produce_entity/live-resource-detail.entity';
import { Dress } from 'src/database/produce_entity/dress.entity';
import { Nametag } from 'src/database/produce_entity/nametag.entity';
import { Emoticon } from 'src/database/produce_entity/emoticon.entity';
import { EmoticonSlave } from 'src/database/produce_entity/emoticon-slave.entity';
import { SoundResource } from 'src/database/produce_entity/sound-resource.entity';
import { LiveLocalization } from 'src/database/produce_entity/live-localization.entity';
import { Loading } from 'src/database/produce_entity/loading.entity';
import { LoadingDetail } from 'src/database/produce_entity/loading-detail.entity';

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
      LiveResource,
      LiveResourceDetail,
      LiveLocalization,
      Dress,
      Nametag,
      Emoticon,
      EmoticonSlave,
      SoundResource,
      Loading,
      LoadingDetail,
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
