import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

// * Live2D & Spine 모델 Entity

export class Model {
  @PrimaryGeneratedColumn()
  model_id: number;

  project_id: number;

  model_name: string;

  model_type: string;

  @Column({ default: 0, type: 'float', comment: '위치 오프셋 X좌표' })
  offset_x: number;

  @Column({ default: 0, type: 'float', comment: '위치 오프셋 X좌표' })
  offset_y: number;

  @Column({ default: 1 })
  game_scale: number;

  @Column({ default: 0 })
  sortkey: number;

  @VersionColumn()
  model_ver: number;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @Column({ select: false, default: true, type: 'boolean' })
  is_updated: boolean; // 컨텐츠 배포 이후 수정 발생 여부

  @Column({ select: false, nullable: true })
  last_deployed_at: Date; // 마지막 배포 시간
}
