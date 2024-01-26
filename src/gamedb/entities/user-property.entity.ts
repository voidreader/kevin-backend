import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

// * 유저가 보유한 아이템!

@Entity({ database: 'game' })
@Index(['userkey', 'item_id', 'expire_date'])
export class UserProperty extends CoreEntity {
  @Column()
  userkey: number;

  @Column()
  item_id: number;

  @Column()
  project_id: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: 1 })
  current_quantity: number;

  @Column({
    type: 'datetime',
    default: '9999-12-31 00:00:00',
    comment: '만료 일시',
  })
  expire_date: Date;

  @Column({ type: 'boolean', default: false, comment: '유료 재화 여부' })
  paid: boolean;

  @Column({ length: 20, comment: '획득 경로', default: '-' })
  path_code: string;

  @Column({ default: 0, comment: '획득한 에피소드 ID' })
  episode_id: number;
}
