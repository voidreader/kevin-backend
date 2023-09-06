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

// * 유저의 선택지 선택 진행상황 (reset시 삭제되는 데이터)

@Entity({ database: 'game' })
@Index(['userkey', 'project_id'])
export class UserSelectionProgress {
  @PrimaryColumn()
  userkey: number;

  @PrimaryColumn()
  episode_id: number;

  @PrimaryColumn({ length: 10 })
  target_scene_id: string;

  @Column({ length: 240 })
  selection_data: string;

  @Column()
  project_id: number;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;
}
