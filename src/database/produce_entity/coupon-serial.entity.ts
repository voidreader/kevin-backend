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
@Unique(['coupon', 'serial'])
export class CouponSerial extends CoreEntity {
  @Column({ length: 20 })
  serial: string;

  @ManyToOne((type) => Coupon, (coupon) => coupon.serials, {})
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;
}
