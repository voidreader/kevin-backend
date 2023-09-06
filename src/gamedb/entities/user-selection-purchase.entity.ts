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
export class UserSelectionPurchase {
  @PrimaryColumn()
  userkey: number;

  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn()
  episode_id: number;

  @PrimaryColumn()
  selection_group: number;

  @PrimaryColumn()
  selection_no: number;

  @Column({ default: 0 })
  price: number;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;
}
