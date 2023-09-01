import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'game' })
export class UserCoupon {
  @PrimaryColumn()
  userkey: number;

  @PrimaryColumn()
  coupon_id: number;

  @PrimaryColumn({ length: 20 })
  coupon_code: string;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
