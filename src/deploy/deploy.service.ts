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
import { Script } from 'src/database/produce_entity/script.entity';
import { TextLocalize } from 'src/database/produce_entity/text-localize.entity';
import { StandardInfo } from 'src/database/produce_entity/standard-info.entity';
import { ItemGift } from 'src/database/produce_entity/item-gift.entity';
import { AdventureReward } from 'src/database/produce_entity/adventure-reward.entity';
import { Selection } from 'src/database/produce_entity/selection.entity';
import { Episode } from 'src/database/produce_entity/episode.entity';

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

    @InjectRepository(Script, 'live-produce')
    private readonly liveScriptRep: Repository<Script>,
    @InjectRepository(Script)
    private readonly devScriptRep: Repository<Script>,

    @InjectRepository(Selection, 'live-produce')
    private readonly liveSelectionRep: Repository<Selection>,
    @InjectRepository(Selection)
    private readonly devSelectionRep: Repository<Selection>,

    @InjectRepository(TextLocalize, 'live-produce')
    private readonly liveTextLocalizeRep: Repository<TextLocalize>,
    @InjectRepository(TextLocalize)
    private readonly devTextLocalizeRep: Repository<TextLocalize>,

    @InjectRepository(StandardInfo, 'live-produce')
    private readonly liveStandardInfoRep: Repository<StandardInfo>,
    @InjectRepository(StandardInfo)
    private readonly devStandardInfoRep: Repository<StandardInfo>,

    @InjectRepository(ItemGift, 'live-produce')
    private readonly liveItemGiftRep: Repository<ItemGift>,
    @InjectRepository(ItemGift)
    private readonly devItemGiftRep: Repository<ItemGift>,

    @InjectRepository(AdventureReward, 'live-produce')
    private readonly liveAdventureRewardRep: Repository<AdventureReward>,
    @InjectRepository(AdventureReward)
    private readonly devAdventureRewardRep: Repository<AdventureReward>,

    @InjectRepository(Episode, 'live-produce')
    private readonly liveEpisodeRep: Repository<Episode>,
    @InjectRepository(Episode)
    private readonly devEpisodeRep: Repository<Episode>,
  ) {}

  // * 프로젝트별 데이터 배포 히스토리
  // 공용 데이터는 0으로 처리
  async getLastDeployHistory(
    project_id: number,
    data_type: string,
  ): Promise<Date> {
    const hist = await this.deployHistRep.find({
      where: { project_id, data_type },
    });

    if (hist.length == 0) return new Date('2020-01-01 00:00:00');
    else hist[0].last_deploy_at;
  } // ? END getLastDeployHistory

  // * 모든 에피소드 및 스크립트
  async deployAllEpisodeScript(project_id: number, episode_id: number) {
    const episodes = await this.devEpisodeRep.find({ where: { project_id } });

    for await (const episode of episodes) {
      const result = await this.deployEpisode(
        project_id,
        episode.episode_id,
        false,
      );

      if (!result) {
        this.logger.error(`${episode.episode_id} 에피소드 배포에 실패했습니다`);
      }
    }
  } // ? END deployAllEpisodeScript

  // * 에피소드별 배포
  async deployEpisode(
    project_id: number,
    episode_id: number,
    needRespose: boolean,
  ): Promise<DeploySimpleOutputDto | boolean> {
    const episode = await this.devEpisodeRep.find({
      where: { project_id, episode_id },
    });

    if (!episode) {
      if (needRespose) {
        return { isSuccess: false, message: 'Invalid episode id' };
      } else {
        return false;
      }
    } // 에피소드 없는 경우에 대한 체크 끝

    try {
      await this.liveEpisodeRep.save(episode); // 에피소드 저장
      const scriptResult = await this.deployScript(project_id, episode_id);

      if (!scriptResult) {
        this.logger.error(`${episode_id} 스크립트 배포 실패 `);
      }

      if (needRespose) {
        return { isSuccess: true };
      } else {
        return true;
      }
    } catch (error) {
      if (needRespose) {
        return { isSuccess: false, error: JSON.stringify(error) };
      } else {
        return false;
      }
    }
  } // ? END deployEpisode

  // * 스크립트
  async deployScript(project_id: number, episode_id: number) {
    // 배포 일시에 관계없는 무조건 배포.
    const targets = await this.devScriptRep.find({
      where: { project_id, episode_id },
    });

    const selectionTargets = await this.devSelectionRep.find({
      where: { project_id, episode_id },
    });

    this.logger.info(
      `${episode_id}의 스크립트 배포 시작 [${targets.length}행]`,
    );

    if (targets.length == 0) {
      this.logger.info(`${episode_id}의 스크립트 데이터 없음 `);
      return true;
    }

    try {
      await this.liveScriptRep.save(targets);

      if (selectionTargets.length > 0) {
        await this.liveSelectionRep.save(selectionTargets);
      }
      this.logger.info(`${episode_id}의 스크립트 배포 완료`);

      const newHist = this.deployHistRep.create();
      newHist.data_type = `script_${episode_id}`;
      newHist.project_id = 148;

      this.deployHistRep.save(newHist);

      return true; // 종료
    } catch (error) {
      this.logger.error(`${episode_id} 배포 실패 : ${JSON.stringify(error)}`);

      return false;
    }
  } // ? END 스크립트 처리 완료

  // * 공용 데이터 배포
  // standard_info, text_localize
  async deployCommonData(data_type: string): Promise<DeploySimpleOutputDto> {
    this.logger.info(`${data_type} deploy start`);

    if (data_type != 'localize' && data_type != 'standard') {
      return { isSuccess: false, error: 'wrong data type' };
    }

    // 히스토리 조회
    const lastDeployDate: Date = await this.getLastDeployHistory(0, data_type);

    const devRep = this.getDevRepository(data_type);
    const liveRep = this.getLiveRepository(data_type);

    if (!devRep || !liveRep) {
      return { isSuccess: false, error: 'invalid data type' };
    }

    const targets = await devRep.find({
      where: { updated_at: MoreThanOrEqual(lastDeployDate) },
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
          project_id: 0,
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
  } // ? END deployCommonData

  // * 프로젝트에 귀속된 데이터 배포
  // 쿠폰, 공지사항, 아이템, 인앱상품
  async deployProjectData(project_id: number, data_type: string) {
    // 히스토리 조회
    const lastDeployDate: Date = await this.getLastDeployHistory(
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
  getDevRepository(
    data_type: string,
  ): Repository<
    Coupon | Notice | Product | Item | TextLocalize | StandardInfo | ItemGift
  > {
    switch (data_type) {
      case 'notice':
        return this.devNoticeRep;

      case 'coupon':
        return this.devCouponRep;
      case 'product':
        return this.devProductRep;
      case 'item':
        return this.devItemRep;

      case 'localize':
        return this.devTextLocalizeRep;
      case 'standard':
        return this.devStandardInfoRep;

      case 'item-gift':
        return this.devItemGiftRep;

      default:
        return null;
    }
  } // ? END getDevRepository

  // * 라이브 서버 Repository
  getLiveRepository(
    data_type: string,
  ): Repository<
    Coupon | Notice | Product | Item | TextLocalize | StandardInfo | ItemGift
  > {
    switch (data_type) {
      case 'notice':
        return this.liveNoticeRep;

      case 'coupon':
        return this.liveCouponRep;
      case 'product':
        return this.liveProductRep;
      case 'item':
        return this.liveItemRep;
      case 'localize':
        return this.liveTextLocalizeRep;
      case 'standard':
        return this.liveStandardInfoRep;

      case 'item-gift':
        return this.liveItemGiftRep;

      default:
        return null;
    }
  } // ? END getDevRepository
}
