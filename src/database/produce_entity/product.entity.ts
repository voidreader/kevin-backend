import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import { DeployableEntity } from 'src/common/entities/deployable.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProductDetail } from './product-detail.entity';
import { ProductLang } from './product-lang.entity';

export enum ProductTypeEnum {
  base = 'base',
  limited = 'limited',
  premium_pass = 'premium_pass',
}

export class Product extends DeployableEntity {
  @PrimaryGeneratedColumn()
  master_id: number;

  @Column({ length: 20, comment: '인앱상품ID' })
  product_id: string;

  @Column({ length: 30, comment: '인앱상품명' })
  product_name: string;

  @Column({
    type: 'enum',
    enum: ProductTypeEnum,
    comment: '상품 타입',
  })
  product_type: ProductTypeEnum;

  @Column({ default: () => 'CURRENT_TIMESTAMP', comment: '판매 시작일시' })
  from_date: Date;

  @Column({ default: '9999-12-31', comment: '판매 종료일시' })
  to_date: Date;

  @Column({ default: 1, comment: '구매 제한 횟수' })
  max_count: number;

  @Column({ length: 30, default: '', comment: '보너스 표시' })
  bonus_name: string;

  @Column({ type: 'boolean', default: false })
  is_public: boolean;

  @Column({ length: 30, default: '' })
  exception_culture: string;

  @Column()
  project_id: number;

  langs: ProductLang[];

  details: ProductDetail[];
}
