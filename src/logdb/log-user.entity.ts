import { BigCoreEntity } from 'src/common/entities/big-core.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity()
@Index(['userkey', 'created_at', 'action_type'])
@Index(['created_at', 'project_id', 'action_type'])
export class LogUser extends BigCoreEntity {
  @Column()
  userkey: number;
  @Column()
  project_id: number;

  @Column({ default: 0 })
  episode_id: number;

  @Column({ length: 30 })
  action_type: string;

  @Column({ length: 400 })
  log_data: string; // 로그 데이터
}
