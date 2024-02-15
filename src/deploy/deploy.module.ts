import { Module } from '@nestjs/common';
import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from 'src/database/produce_entity/coupon.entity';
import { CouponReward } from 'src/database/produce_entity/coupon-reward.entity';
import { CouponSerial } from 'src/database/produce_entity/coupon-serial.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon, CouponReward, CouponSerial]),
    TypeOrmModule.forFeature(
      [Coupon, CouponReward, CouponSerial],
      'live-produce',
    ),
  ],
  controllers: [DeployController],
  providers: [DeployService],
})
export class DeployModule {}
