import { Module } from '@nestjs/common';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUser } from 'src/gamedb/entities/game-user.entity';
import { Profile } from 'src/database/produce_entity/profile.entity';
import { Ability } from 'src/database/produce_entity/ability.entity';
import { Item } from 'src/database/produce_entity/item.entity';
import { ItemExtension } from 'src/database/produce_entity/item-extension.entity';
import { ItemLang } from 'src/database/produce_entity/item-lang.entity';
import { Model } from 'src/database/produce_entity/model.entity';
import { ModelSlave } from 'src/database/produce_entity/model-slave.entity';
import { LiveResource } from 'src/database/produce_entity/live-resource.entity';
import { Nametag } from 'src/database/produce_entity/nametag.entity';
import { SoundResource } from 'src/database/produce_entity/sound-resource.entity';
import { Episode } from 'src/database/produce_entity/episode.entity';
import { Selection } from 'src/database/produce_entity/selection.entity';
import { Script } from 'src/database/produce_entity/script.entity';
import { Package } from 'src/database/produce_entity/package.entity';
import { PackageClient } from 'src/database/produce_entity/package-client.entity';
import { Product } from 'src/database/produce_entity/product.entity';
import { ProductDetail } from 'src/database/produce_entity/product-detail.entity';
import { ProductLang } from 'src/database/produce_entity/product-lang.entity';
import { Loading } from 'src/database/produce_entity/loading.entity';
import { Emoticon } from 'src/database/produce_entity/emoticon.entity';
import { Dress } from 'src/database/produce_entity/dress.entity';
import { TextLocalize } from 'src/database/produce_entity/text-localize.entity';
import { ProfileLineLang } from 'src/database/produce_entity/profile-line-lang.entity';
import { ProfileLine } from 'src/database/produce_entity/profile-line.entity';
import { Project } from 'src/database/produce_entity/project.entity';
import { ProfileLang } from 'src/database/produce_entity/profile-lang.entity';
import { AbilityLang } from 'src/database/produce_entity/ability-lang.entity';
import { StoryStaticImage } from 'src/database/produce_entity/story-static-image.entity';
import { PublicExtension } from 'src/database/produce_entity/public-extension.entity';
import { ImageLocalization } from 'src/database/produce_entity/image-localization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameUser], 'game'),
    TypeOrmModule.forFeature([
      Profile,
      Ability,
      Item,
      ItemExtension,
      ItemLang,
      Model,
      ModelSlave,
      LiveResource,
      Nametag,
      SoundResource,
      Episode,
      Selection,
      Script,
      Package,
      PackageClient,
      Product,
      ProductDetail,
      ProductLang,
      Loading,
      Emoticon,
      Dress,
      TextLocalize,
      ProfileLine,
      ProfileLineLang,
      ProfileLang,
      AbilityLang,
      Project,
      StoryStaticImage,
      PublicExtension,
      ImageLocalization,
    ]),
  ],
  controllers: [MigrationController],
  providers: [MigrationService],
})
export class MigrationModule {}
