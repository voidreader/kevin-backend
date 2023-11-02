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
import { Item } from './item.entity';
import { IsIn } from 'class-validator';
import { StoryStaticImage } from 'src/resource-manager/entities/story-static-image.entity';
import { LocalDateTimeTransformer } from 'src/util/time-transformer';

// * 아이템의 확장 정보 (판매 등의 정보)

@Entity()
export class ItemExtension extends CoreEntity {
  @Column({ length: 30, comment: '제품 판매 형태', default: 'free' })
  product_type: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 0, comment: '할인 가격' })
  sale_price: number;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    comment: '세일 시작 일시',
    transformer: new LocalDateTimeTransformer(),
  })
  sale_start_date: Date;
  @Column({
    default: '9999-12-31',
    comment: '세일 종료 일시',
    transformer: new LocalDateTimeTransformer(),
  })
  sale_end_date: Date;

  @Column({ type: 'boolean', default: true })
  is_public: boolean;

  @Column({ comment: '연결되는 이미지 리소스 id', default: -1 })
  static_id: number;
}
