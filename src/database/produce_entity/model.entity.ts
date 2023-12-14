import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ModelSlave } from './model-slave.entity';

// * Live2D & Spine 모델 Entity

@Entity()
@Index(['project_id'])
export class Model {
  @PrimaryGeneratedColumn()
  model_id: number;

  @Column()
  project_id: number;

  @Column({ length: 30 })
  model_name: string;

  @Column({ length: 20, default: 'live2d' })
  model_type: string;

  @Column({ default: 0, type: 'float', comment: '인게임 위치 오프셋 X좌표' })
  offset_x: number;

  @Column({ default: 0, type: 'float', comment: '인게임 위치 오프셋 y좌표' })
  offset_y: number;

  @Column({ default: 1, type: 'float', comment: '인게임 게임스케일' })
  game_scale: number;

  @Column({ default: 0, type: 'float', comment: '로비 위치 오프셋 X좌표' })
  lobby_offset_x: number;

  @Column({ default: 0, type: 'float', comment: '로비 위치 오프셋 y좌표' })
  lobby_offset_y: number;

  @Column({ default: 1, type: 'float', comment: '로비 게임스케일' })
  lobby_game_scale: number;

  @Column({ default: 0 })
  sortkey: number;

  @Column({
    default: 'center',
    comment: '캐릭터의 시선 방향 (left,right,center)',
  })
  direction: string;

  @Column({ default: 0, comment: '캐릭터의 키(0,1,2,3) - 위치값 조정에 사용' })
  tall_grade: number;

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

  @OneToMany((type) => ModelSlave, (ms) => ms.model, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  slaves: ModelSlave[];
}
