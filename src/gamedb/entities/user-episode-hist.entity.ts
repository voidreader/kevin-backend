import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'game' })
@Unique(['userkey', 'project_id', 'episode_id'])
export class UserEpisodeHist {
  @PrimaryColumn()
  userkey: number;

  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn()
  episode_id: number;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
