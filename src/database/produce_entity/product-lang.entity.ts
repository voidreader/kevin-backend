import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

// 상품 언어별 정보
export class ProductLang {
  master_id: number;
  lang: string;
  title: string;

  @Column({ length: 160, nullable: true })
  banner_url: string;
  @Column({ length: 120, nullable: true })
  banner_key: string;
  @Column({ length: 30, nullable: true })
  bucket: string;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;

  product: Product;
}
