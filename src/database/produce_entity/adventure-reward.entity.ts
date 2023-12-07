import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['project_id', 'item_id'])
export class AdventureReward extends CoreEntity {
  @Column()
  project_id: number;

  @Column()
  item_id: number;

  @Column({ comment: '지급되는 최소 수량', default: 1 })
  min_count: number;

  @Column({ comment: '지급되는 최대 수량', default: 1 })
  max_count: number;

  @Column({ comment: '지급확률 (천분율)', default: 0 })
  chance: number;

  @Column({ comment: '천분율로 배치되는 확률 범위 (min)', default: 0 })
  min_chance: number;

  @Column({ comment: '천분율로 배치되는 확률 범위 (min)', default: 0 })
  max_chance: number;
}
