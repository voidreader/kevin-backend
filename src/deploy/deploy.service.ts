import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/database/produce_entity/coupon.entity';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston/dist/winston.constants';
import { Logger as WinstonLogger } from 'winston';
import { DeployHistory } from 'src/database/produce_entity/deploy-history.entity';

@Injectable()
export class DeployService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,

    @InjectRepository(DeployHistory)
    private readonly deployHistRep: Repository<DeployHistory>,

    @InjectRepository(Coupon, 'live-produce')
    private readonly liveCouponRep: Repository<Coupon>,
    @InjectRepository(Coupon)
    private readonly devCouponRep: Repository<Coupon>,
  ) {}

  async getLastHistory(project_id: number, data_type: string): Promise<Date> {
    const hist = await this.deployHistRep.find({
      where: { project_id, data_type },
    });

    if (hist.length == 0) return new Date('2020-01-01 00:00:00');
    else hist[0].last_deploy_at;
  }

  // 모든 쿠폰
  async deployAllCoupon(project_id: number) {
    // 히스토리 조회
    const lastDeployDate: Date = await this.getLastHistory(
      project_id,
      'coupon',
    );

    const coupons = await this.devCouponRep.find({
      where: { project_id, updated_at: MoreThanOrEqual(lastDeployDate) },
      relations: { serials: true, rewards: true },
    });

    this.logger.info('배포 대상 쿠폰 개수 : ', {
      targeCouponCount: coupons.length,
    });

    if (coupons.length > 0) {
      try {
        const result = await this.liveCouponRep.save(coupons);
        this.logger.info(`배포 완료 : `, { resultDataCount: result.length });

        return { isSuccess: true, message: '배포 완료' };
      } catch (error) {
        return {
          isSuccess: false,
          message: '배포 실패',
          error: JSON.stringify(error),
        };
      }
    } else {
      return { isSuccess: true, message: '배포할 신규 항목 없음' };
    }
  }
}
