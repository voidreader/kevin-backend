import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Coupon } from './coupon.entity';

@Entity()
@Unique(['coupon', 'item_id'])
export class CouponReward extends CoreEntity {
  @Column()
  item_id: number;

  @Column()
  quantity: number;

  @ManyToOne((type) => Coupon, (coupon) => coupon.serials, {})
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;
}
