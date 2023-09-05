import { BigCoreEntity } from 'src/common/entities/big-core.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity({ database: 'game' })
@Index(['userkey', 'created_at'])
export class UserMail extends BigCoreEntity {
  @Column()
  userkey: number;

  @Column({ comment: '메일 유형' })
  mail_type: string;

  @Column({ default: -1, comment: '지급되는 아이템 ID' })
  item_id: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ comment: '만료일' })
  expire_date: Date;

  @Column()
  receive_date: Date;

  @Column({ default: 0 })
  project_id: number;

  @Column({ default: 0, comment: '유료상품 구매 내역 연결점' })
  purchase_id: number;

  @Column({ length: 120, nullable: true, comment: 'Direct message 용도' })
  message: string;
}
