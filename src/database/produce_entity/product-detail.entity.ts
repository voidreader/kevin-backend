import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Entity,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { Item } from './item.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

// * 상품 구성품 정보
@Entity()
@Unique(['product', 'item_id', 'is_main'])
export class ProductDetail extends CoreEntity {
  @Column({ type: 'boolean', default: true })
  is_main: boolean;

  @Column({ default: 0 })
  quantity: number;

  @Column({ type: 'boolean', default: false })
  first_purchase: boolean;

  @ManyToOne((type) => Product, (p) => p.langs)
  @JoinColumn({ name: 'master_id' })
  product: Product;

  @Column({ comment: '아이템 ID' })
  item_id: number;
}
