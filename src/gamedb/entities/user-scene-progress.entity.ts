import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'game' })
export class UserSceneProgress {
  @PrimaryColumn()
  userkey: number;

  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn()
  episode_id: number;

  @PrimaryColumn()
  scene_id: number;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;
}
