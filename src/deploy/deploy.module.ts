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
      ],
      'live-produce',
    ),
  ],
  controllers: [DeployController],
  providers: [DeployService],
})
export class DeployModule {}
