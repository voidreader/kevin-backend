import { IsEnum } from 'class-validator';
import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { LocalDateTimeTransformer } from 'src/util/time-transformer';
import { CouponSerial } from './coupon-serial.entity';
import { CouponReward } from './coupon-reward.entity';

export enum CouponType {
  keyword = 'keyword',
  serial = 'serial',
}

@Entity()
@Index(['project_id', 'start_date', 'end_date'])
export class Coupon extends CoreDeployEntity {
  @Column({ length: 40 })
  coupon_name: string;

  @Column({ type: 'enum', enum: CouponType })
  @IsEnum(CouponType)
  coupon_type: string;

  @Column({ length: 20 })
  keyword: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    comment: '쿠폰 시작일시',
    transformer: new LocalDateTimeTransformer(),
  })
  start_date: Date;

  @Column({
    default: '9999-12-31',
    comment: '쿠폰 종료일시',
    transformer: new LocalDateTimeTransformer(),
  })
  end_date: Date;

  @Column({ default: 1, comment: '사용횟수 제한' })
  use_limit: number;

  @Column({ comment: '발행 건수' })
  issue_count: number;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    comment: '발행일시',
    transformer: new LocalDateTimeTransformer(),
  })
  issue_date: Date;

  @Column({ comment: '키워드 쿠폰 남은 횟수' })
  remain_keyword_count: number;

  @Column()
  project_id: number;

  @Column({ comment: '해금되는 DLC ID', default: -1 })
  unlock_dlc_id: number;

  @OneToMany((type) => CouponSerial, (couponSerial) => couponSerial.coupon, {
    eager: true,
    cascade: true,
  })
  serials: CouponSerial[];

  @OneToMany((type) => CouponReward, (couponReward) => couponReward.coupon, {
    eager: true,
    cascade: true,
  })
  rewards: CouponReward[];
}
