import { CoreEntity } from 'src/common/entities/core.entity';
import { LocalDateTimeTransformer } from 'src/util/time-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'game' })
@Unique(['userkey', 'project_id'])
export class UserAdventureReward extends CoreEntity {
  @Column()
  userkey: number;

  @Column()
  project_id: number;

  @Column({ comment: '지급된 아이템 ID' })
  item_id: number;

  @Column({ default: 1, comment: '지급된 아이템 수량' })
  item_count: number;
}
