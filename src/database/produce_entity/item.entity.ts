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
import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import { IsIn } from 'class-validator';
import { ItemLang } from './item-lang.entity';
import { ItemExtension } from './item-extension.entity';

// * 아이템 마스터 entity

@Entity()
@Index(['item_type', 'resource_id'])
export class Item extends CoreDeployEntity {
  @Column({ length: 30, comment: '관리 이름' })
  origin_name: string;

  @Column({ length: 30, comment: '아이템 타입' })
  @IsIn(['consumable', 'nonconsumable', 'standing', 'gift'])
  item_type: string;

  @Column({ default: -1 })
  project_id: number;

  @Column({ type: 'boolean', default: false, comment: '유일성 여부' })
  is_unique: boolean;
  @Column({ type: 'boolean', default: false, comment: '소모성 여부' })
  is_consumable: boolean;
  @Column({ type: 'boolean', default: false, comment: '활성화 여부' })
  is_active: boolean;
  @Column({ type: 'boolean', default: false, comment: '능력 보유 여부' })
  is_ability: boolean;

  @Column({ length: 160, nullable: true, comment: '아이템 아이콘' })
  icon_url: string;
  @Column({ length: 120, nullable: true })
  icon_key: string;
  @Column({ length: 30, nullable: true })
  icon_bucket: string;

  @Column({ length: 160, nullable: true, comment: '야이템 상세 이미지' })
  image_url: string;
  @Column({ length: 120, nullable: true })
  image_key: string;
  @Column({ length: 30, nullable: true })
  image_bucket: string;

  @Column({ default: -1, comment: '특정 리소스와 연결된 경우 리소스의 ID' })
  resource_id: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: '메인 유료 재화인지 여부',
  })
  is_prime: boolean;

  @Column({ default: '-', comment: '구 데이터 currency 코드' })
  currency: string;

  @Column({ comment: '연결된 능력 ID', default: 0 })
  ability_id: number;
  @Column({ comment: '능력 증감 수치', default: 0 })
  ability_value: number;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;

  @OneToMany((type) => ItemLang, (itemLang) => itemLang.item, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  localizations: ItemLang[];

  @OneToOne((type) => ItemExtension, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'extension_id' })
  extension: ItemExtension;
}
