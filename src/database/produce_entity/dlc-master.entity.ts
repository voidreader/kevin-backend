import { IsEnum } from 'class-validator';
import { DeployableEntity } from 'src/common/entities/deployable.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DlcDetail } from './dlc-detail.entity';

export enum DLCTypeEnum {
  free = 'free',
  paid = 'paid',
  coupon = 'coupon',
}

@Entity()
@Index(['project_id', 'dlc_id'])
@Unique(['project_id', 'dlc_name'])
export class DlcMaster extends DeployableEntity {
  @PrimaryGeneratedColumn()
  dlc_id: number; // DLC ID

  @Column({ length: 30 })
  dlc_name: string;

  @Column({ type: 'enum', enum: DLCTypeEnum, default: DLCTypeEnum.free })
  @IsEnum(DLCTypeEnum)
  dlc_type: DLCTypeEnum;

  @Column({ default: 0 })
  price: number;
  @Column({ default: 0 })
  sale_price: number;

  @Column({ default: '', length: 30, comment: '주 캐릭터' })
  cast1: string;
  @Column({ default: '', length: 30, comment: '주 캐릭터' })
  cast2: string;
  @Column({ default: '', length: 30, comment: '주 캐릭터' })
  cast3: string;
  @Column({ default: '', length: 30, comment: '주 캐릭터' })
  cast4: string;

  @Column({ type: 'boolean', default: false })
  is_public: boolean;

  @Column({ length: 30, default: '-' })
  exception_culture: string;

  @Column()
  project_id: number;

  @OneToMany((t) => DlcDetail, (detail) => detail.master, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  details: DlcDetail[];
}
