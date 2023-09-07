import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'game' })
@Index(['userkey', 'created_at'])
@Index(['created_at', 'product_id'])
export class UserPurchase {
  @PrimaryGeneratedColumn()
  purchase_no: number;

  @Column()
  userkey: number;

  @Column({ length: 20 })
  product_id: string;

  @Column({ length: 200, nullable: true })
  receipt: string;

  @Column({ default: 0, comment: '상태' })
  state: number;

  @Column({ default: 0 })
  price: number;

  @Column({ length: 20 })
  product_currency: string;

  @Column({ length: 100, nullable: true })
  payment_seq: string;

  @Column({ length: 200, nullable: true })
  purchase_token: string;

  @Column({ default: -1 })
  product_master_id: number;

  @Column({ type: 'float', comment: 'KRW 환산 가격', default: 0 })
  krw: number;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
