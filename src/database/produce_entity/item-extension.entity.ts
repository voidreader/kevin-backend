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

// * 아이템의 확장 정보 (판매 등의 정보)

@Entity()
@Index('IDX_item_parent', ['item'])
export class ItemExtension extends CoreEntity {
  @Column({ length: 30, comment: '제품 판매 형태' })
  @IsIn(['free', 'coupon', 'gameplay'])
  product_type: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 0, comment: '할인 가격' })
  sale_price: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP', comment: '세일 시작 일시' })
  sale_start_date: Date;
  @Column({ default: '9999-12-31', comment: '세일 종료 일시' })
  sale_end_date: Date;

  @Column({ type: 'boolean', default: true })
  is_public: boolean;

  @OneToOne((type) => Item, (item) => item.extension)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  // 연결되는 배경 이미지 등을 위한 관계 추가
  @OneToOne(() => StoryStaticImage)
  @JoinColumn({ name: 'static_id' })
  connectedImage: StoryStaticImage;
}