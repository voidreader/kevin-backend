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
export class UserAdventure extends CoreEntity {
  @Column()
  userkey: number;
  @Column()
  project_id: number;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    comment: '모험을 시작한 시간 (서버시간 기준)',
    transformer: new LocalDateTimeTransformer(),
  })
  start_time: Date;

  @Column({
    comment: '모험을 끝나는 시간 (서버시간 기준)',
    transformer: new LocalDateTimeTransformer(),
  })
  end_time: Date;

  @Column({ comment: '현재 유저의 모험 상태', length: 20 })
  state: string;
  @Column({ comment: '시간을 줄이기 위해 광고를 시청한 횟수', default: 0 })
  ad_count: number;
}
