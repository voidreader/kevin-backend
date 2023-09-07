import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'game' })
export class UserDress extends CoreEntity {
  // ???

  @PrimaryColumn()
  userkey: number;

  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn()
  speaker: string;

  @Column({ length: 30, comment: '의상 이름' })
  dress_name: string;

  @Column({ comment: '연결 모델 ID' })
  model_id: number;
}
