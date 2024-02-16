import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/database/produce_entity/coupon.entity';
import { Repository } from 'typeorm';
import { winstonLogger } from '../util/winston.config';

@Injectable()
export class DeployService {
  constructor(
    @InjectRepository(Coupon, 'live-produce')
    private readonly liveCouponRep: Repository<Coupon>,
    @InjectRepository(Coupon)
    private readonly devCouponRep: Repository<Coupon>,
  ) {}

  async deployAllCoupon(project_id: number) {
    const coupons = await this.devCouponRep.find({
      where: { project_id },
      relations: { serials: true, rewards: true },
    });

    winstonLogger.debug(
      {
        couponCount: coupons.length,
      },
      'deployAllCoupon start',
    );

    // 저장하기
    const result = await this.liveCouponRep.save(coupons);

    winstonLogger.debug(
      {
        deployedCouponCount: result.length,
      },
      'deployAllCoupon done',
    );

    return { isSuccess: true };
  }
}
