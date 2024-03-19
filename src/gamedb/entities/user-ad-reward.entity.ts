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

@Entity({ database: 'game' })
@Index(['userkey', 'local_receive_date'])
export class UserAdReward extends CoreEntity {
  @Column()
  userkey: number;

  @Column()
  project_id: number;

  @Column()
  prime_currency: number;

  @Column()
  local_receive_date: Date;
}
