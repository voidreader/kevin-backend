import { Module } from '@nestjs/common';
import { ResourceUploaderService } from './resource-uploader.service';
import { ResourceUploaderController } from './resource-uploader.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionFactory } from 'src/common/utils/multer.option';
import { ResourceManagerService } from 'src/resource-manager/resource-manager.service';
import { ResourceManagerModule } from 'src/resource-manager/resource-manager.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscardResource } from 'src/database/produce_entity/discard-resource.entity';
import { ImageLocalization } from 'src/database/produce_entity/image-localization.entity';
import { StoryStaticImage } from 'src/database/produce_entity/story-static-image.entity';
import { Project } from 'src/database/produce_entity/project.entity';
import { PublicExtension } from 'src/database/produce_entity/public-extension.entity';
import { Model } from 'src/database/produce_entity/model.entity';
import { ModelSlave } from 'src/database/produce_entity/model-slave.entity';
import { LiveResource } from 'src/database/produce_entity/live-resource.entity';
import { LiveResourceDetail } from 'src/database/produce_entity/live-resource-detail.entity';
import { Dress } from 'src/database/produce_entity/dress.entity';
import { Nametag } from 'src/database/produce_entity/nametag.entity';
import { Emoticon } from 'src/database/produce_entity/emoticon.entity';
import { EmoticonSlave } from 'src/database/produce_entity/emoticon-slave.entity';
import { SoundResource } from 'src/database/produce_entity/sound-resource.entity';
import { LiveLocalization } from 'src/database/produce_entity/live-localization.entity';
import { LoadingDetail } from 'src/database/produce_entity/loading-detail.entity';
import { Loading } from 'src/database/produce_entity/loading.entity';

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
      Dress,
      Nametag,
      Emoticon,
      EmoticonSlave,
      SoundResource,
      LiveLocalization,
      LoadingDetail,
      Loading,
    ]),
  ],

  providers: [ResourceUploaderService, ResourceManagerService],
  controllers: [ResourceUploaderController],
})
export class ResourceUploaderModule {}
