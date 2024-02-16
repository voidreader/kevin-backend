import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/database/produce_entity/coupon.entity';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston/dist/winston.constants';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class DeployService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,

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

    this.logger.info('deploy All Coupon start : ', {
      targeCouponCount: coupons.length,
    });

    // winstonLogger.debug(
    //   {
    //     couponCount: coupons.length,
    //   },
    //   'deployAllCoupon start',
    // );

    // 저장하기
    // const result = await this.liveCouponRep.save(coupons);

    // winstonLogger.debug(
    //   {
    //     deployedCouponCount: result.length,
    //   },
    //   'deployAllCoupon done',
    // );

    return { isSuccess: true };
  }
}
