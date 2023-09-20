import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

// * 상품 구성품 정보
export class ProductDetail {
  item_id: number;
  is_main: boolean;
  quantity: number;
  first_purchase: boolean;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;

  product: Product;
}
