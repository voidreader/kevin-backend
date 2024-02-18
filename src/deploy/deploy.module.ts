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
      ],
      'live-produce',
    ),
  ],
  controllers: [DeployController],
  providers: [DeployService],
})
export class DeployModule {}
