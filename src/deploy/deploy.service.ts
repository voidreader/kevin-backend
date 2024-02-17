import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/database/produce_entity/coupon.entity';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston/dist/winston.constants';
import { Logger as WinstonLogger } from 'winston';
import { DeployHistory } from 'src/database/produce_entity/deploy-history.entity';
import { DeploySimpleOutputDto } from './dto/deploy.dto';
import { Notice } from 'src/database/produce_entity/notice.entity';
import { Product } from 'src/database/produce_entity/product.entity';
import { Item } from 'src/database/produce_entity/item.entity';

@Injectable()
export class DeployService {
  // 라이브 서버, 개발 서버 rep 모두 주입하기
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,

    @InjectRepository(DeployHistory)
    private readonly deployHistRep: Repository<DeployHistory>,

    @InjectRepository(Coupon, 'live-produce')
    private readonly liveCouponRep: Repository<Coupon>,
    @InjectRepository(Coupon)
    private readonly devCouponRep: Repository<Coupon>,

    @InjectRepository(Notice, 'live-produce')
    private readonly liveNoticeRep: Repository<Notice>,
    @InjectRepository(Notice)
    private readonly devNoticeRep: Repository<Notice>,

    @InjectRepository(Product, 'live-produce')
    private readonly liveProductRep: Repository<Product>,
    @InjectRepository(Product)
    private readonly devProductRep: Repository<Product>,

    @InjectRepository(Item, 'live-produce')
    private readonly liveItemRep: Repository<Item>,
    @InjectRepository(Item)
    private readonly devItemRep: Repository<Item>,
  ) {}

  async getLastHistory(project_id: number, data_type: string): Promise<Date> {
    const hist = await this.deployHistRep.find({
      where: { project_id, data_type },
    });

    if (hist.length == 0) return new Date('2020-01-01 00:00:00');
    else hist[0].last_deploy_at;
  } // ? END getLastHistory

  // * 운영데이터 배포
  // 쿠폰, 공지사항, 아이템, 인앱상품
  async deployOperateData(project_id: number, data_type: string) {
    // 히스토리 조회
    const lastDeployDate: Date = await this.getLastHistory(
      project_id,
      data_type,
    );

    const devRep = this.getDevRepository(data_type);
    const liveRep = this.getLiveRepository(data_type);

    if (!devRep || !liveRep) {
      return { isSuccess: false, error: 'invalid data type' };
    }

    // 운영 데이터는 모두 eager 처리로 자동 불러오기가 되어야한다.
    // 마지막 배포일 기준 변경된 데이터만 가져오기
    const targets = await devRep.find({
      where: { project_id, updated_at: MoreThanOrEqual(lastDeployDate) },
    });

    this.logger.info(`${data_type} 배포 대상 데이터 개수 : `, {
      targetCount: targets.length,
    });

    if (targets.length > 0) {
      try {
        const result = await liveRep.save(targets);
        this.logger.info(`${data_type} 배포 완료 : `, {
          resultCount: result.length,
        });

        // 저장 후 히스토리 저장
        const newHist = this.deployHistRep.create({
          data_type,
          project_id,
        });
        this.deployHistRep.save(newHist);

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
  } // ? END 운영 데이터 배포

  // 개발 서버 Repository 주세요.
  getDevRepository(data_type: string): Repository<Coupon | Notice | Product> {
    switch (data_type) {
      case 'notice':
        return this.devNoticeRep;

      case 'coupon':
        return this.devCouponRep;

      default:
        return null;
    }
  } // ? END getDevRepository

  // * 라이브 서버 Repository
  getLiveRepository(data_type: string): Repository<Coupon | Notice | Product> {
    switch (data_type) {
      case 'notice':
        return this.liveNoticeRep;

      case 'coupon':
        return this.liveCouponRep;

      default:
        return null;
    }
  } // ? END getDevRepository

  // * 공지사항 배포
  async deployAllNotice(project_id: number): Promise<DeploySimpleOutputDto> {
    // 히스토리 조회
    const lastDeployDate: Date = await this.getLastHistory(
      project_id,
      'notice',
    );

    const targets = await this.devNoticeRep.find({
      where: { project_id, updated_at: MoreThanOrEqual(lastDeployDate) },
      relations: { details: true },
    });

    this.logger.info('배포 대상 쿠폰 개수 : ', {
      targetCount: targets.length,
    });

    if (targets.length > 0) {
      try {
        const result = await this.liveNoticeRep.save(targets);
        this.logger.info(`배포 완료 : `, { resultDataCount: result.length });

        const newHist = this.deployHistRep.create({
          data_type: 'notice',
          project_id,
        });
        this.deployHistRep.save(newHist);

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
  } // ? 공지사항 처리 종료

  // 모든 쿠폰
  async deployAllCoupon(project_id: number): Promise<DeploySimpleOutputDto> {
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

        const newHist = this.deployHistRep.create({
          data_type: 'coupon',
          project_id,
        });
        this.deployHistRep.save(newHist);

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
  } // ? 쿠폰 처리 종료
}
