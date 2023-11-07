import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PackageAd extends CoreEntity {
  @Column({ type: 'boolean', default: false })
  loading_is_active: boolean;

  @Column({ default: 0 })
  loading_interstitial: number;

  @Column({ default: 0 })
  loading_rewarded: number;

  @Column({ type: 'boolean', default: false })
  banner_is_active: boolean;

  @Column({ type: 'boolean', default: false })
  play_is_active: boolean;

  @Column({ default: 0 })
  play_line: number;

  @Column({ default: 0 })
  play_percent: number;

  @Column({ default: 0 })
  play_interstitial: number;

  @Column({ default: 0 })
  play_rewarded: number;

  @Column({ type: 'boolean', default: false })
  selection_is_active: boolean;

  @Column({ default: 0 })
  selection_interstitial: number;

  @Column({ default: 0 })
  selection_rewarded: number;

  @Column({ type: 'boolean', default: false })
  reward_is_active: boolean;

  @Column({ default: 0 })
  reward_interstitial: number;

  @Column({ default: 0 })
  reward_rewarded: number;
}
