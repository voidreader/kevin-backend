import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

// 상품 언어별 정보
@Entity()
@Unique(['product', 'lang'])
export class ProductLang extends CoreEntity {
  @Column({ length: 20 })
  lang: string;
  @Column({ length: 30 })
  title: string;

  @Column({ length: 160, nullable: true })
  banner_url: string;
  @Column({ length: 120, nullable: true })
  banner_key: string;
  @Column({ length: 30, nullable: true })
  bucket: string;

  @ManyToOne((type) => Product, (p) => p.langs)
  @JoinColumn({ name: 'master_id' })
  product: Product;
}
