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
export class UserProject {
  @PrimaryColumn()
  userkey: number;

  @PrimaryColumn()
  project_id: number;

  @Column()
  episode_id: number;

  @Column({ nullable: true, default: 0 })
  scene_id: number;

  @Column({ type: 'bigint', default: 0 })
  script_no: string;

  @Column({
    default: false,
    type: 'boolean',
    comment: '더이상 진행할 곳이 없음',
  })
  is_final: boolean;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
