import { Module } from '@nestjs/common';
import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from 'src/database/produce_entity/coupon.entity';
import { CouponReward } from 'src/database/produce_entity/coupon-reward.entity';
import { CouponSerial } from 'src/database/produce_entity/coupon-serial.entity';
import { DeployHistory } from 'src/database/produce_entity/deploy-history.entity';
import { Notice } from 'src/database/produce_entity/notice.entity';
import { NoticeDetail } from 'src/database/produce_entity/notice-detail.entity';
import { Product } from 'src/database/produce_entity/product.entity';
import { ProductDetail } from 'src/database/produce_entity/product-detail.entity';
import { ProductLang } from 'src/database/produce_entity/product-lang.entity';
import { Item } from 'src/database/produce_entity/item.entity';
import { ItemLang } from 'src/database/produce_entity/item-lang.entity';
import { ItemGift } from 'src/database/produce_entity/item-gift.entity';

import { TextLocalize } from 'src/database/produce_entity/text-localize.entity';
import { StandardInfo } from 'src/database/produce_entity/standard-info.entity';
import { Script } from 'src/database/produce_entity/script.entity';
import { AdventureReward } from 'src/database/produce_entity/adventure-reward.entity';
import { Selection } from 'src/database/produce_entity/selection.entity';
import { Episode } from 'src/database/produce_entity/episode.entity';
import { EpisodeDetail } from 'src/database/produce_entity/episode-detail.entity';
import { EpisodeExtension } from 'src/database/produce_entity/episode-extension.entity';
import { DlcMaster } from 'src/database/produce_entity/dlc-master.entity';
import { DlcDetail } from 'src/database/produce_entity/dlc-detail.entity';
import { Dress } from 'src/database/produce_entity/dress.entity';
import { Ability } from 'src/database/produce_entity/ability.entity';
import { AbilityLang } from 'src/database/produce_entity/ability-lang.entity';
import { Profile } from 'src/database/produce_entity/profile.entity';
import { ProfileLang } from 'src/database/produce_entity/profile-lang.entity';
import { ProfileLine } from 'src/database/produce_entity/profile-line.entity';
import { ProfileLineLang } from 'src/database/produce_entity/profile-line-lang.entity';
import { AdSetting } from 'src/database/produce_entity/ad-setting.entity';
import { Emoticon } from 'src/database/produce_entity/emoticon.entity';
import { EmoticonSlave } from 'src/database/produce_entity/emoticon-slave.entity';
import { ImageLocalization } from 'src/database/produce_entity/image-localization.entity';
import { LiveLocalization } from 'src/database/produce_entity/live-localization.entity';
import { LiveResource } from 'src/database/produce_entity/live-resource.entity';
import { LiveResourceDetail } from 'src/database/produce_entity/live-resource-detail.entity';
import { Loading } from 'src/database/produce_entity/loading.entity';
import { LoadingDetail } from 'src/database/produce_entity/loading-detail.entity';
import { Model } from 'src/database/produce_entity/model.entity';
import { ModelSlave } from 'src/database/produce_entity/model-slave.entity';
import { Nametag } from 'src/database/produce_entity/nametag.entity';
import { Package } from 'src/database/produce_entity/package.entity';
import { PackageAd } from 'src/database/produce_entity/package-ad.entity';
import { PackageClient } from 'src/database/produce_entity/package-client.entity';
import { Project } from 'src/database/produce_entity/project.entity';
import { ProjectDetail } from 'src/database/produce_entity/project-detail.entity';
import { PublicExtension } from 'src/database/produce_entity/public-extension.entity';
import { SideUnlock } from 'src/database/produce_entity/side-unlock.entity';
import { SoundResource } from 'src/database/produce_entity/sound-resource.entity';
import { StoryStaticImage } from 'src/database/produce_entity/story-static-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Coupon,
      CouponReward,
      CouponSerial,
      Notice,
      NoticeDetail,
      Product,
      ProductDetail,
      ProductLang,
      Item,
      ItemLang,
      ItemGift,
      DeployHistory,
      Script,
      Selection,
      TextLocalize,
      StandardInfo,
      AdventureReward,
      Episode,
      EpisodeDetail,
      EpisodeExtension,
      DlcMaster,
      DlcDetail,
      Dress,
      Ability,
      AbilityLang,
      Profile,
      ProfileLang,
      ProfileLine,
      ProfileLineLang,
      AdSetting,
      Emoticon,
      EmoticonSlave,
      ImageLocalization,
      LiveLocalization,
      LiveResource,
      LiveResourceDetail,
      Loading,
      LoadingDetail,
      Model,
      ModelSlave,
      Nametag,
      Package,
      PackageAd,
      PackageClient,
      Project,
      ProjectDetail,
      PublicExtension,
      SideUnlock,
      SoundResource,
      StoryStaticImage,
    ]),
    TypeOrmModule.forFeature(
      [
        Coupon,
        CouponReward,
        CouponSerial,
        Notice,
        NoticeDetail,
        Product,
        ProductDetail,
        ProductLang,
        Item,
        ItemLang,
        ItemGift,
        Script,
        Selection,
        TextLocalize,
        StandardInfo,
        AdventureReward,
        Episode,
        EpisodeDetail,
        EpisodeExtension,
        DlcMaster,
        DlcDetail,
        Dress,
        Ability,
        AbilityLang,
        Profile,
        ProfileLang,
        ProfileLine,
        ProfileLineLang,
        AdSetting,
        Emoticon,
        EmoticonSlave,
        ImageLocalization,
        LiveLocalization,
        LiveResource,
        LiveResourceDetail,
        Loading,
        LoadingDetail,
        Model,
        ModelSlave,
        Nametag,
        Package,
        PackageAd,
        PackageClient,
        Project,
        ProjectDetail,
        PublicExtension,
        SideUnlock,
        SoundResource,
        StoryStaticImage,
      ],
      'live-produce',
    ),
  ],
  controllers: [DeployController],
  providers: [DeployService],
})
export class DeployModule {}
