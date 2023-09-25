import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

// * 유저의 의상 소유 및 세팅 정보

@Entity({ database: 'game' })
export class UserDress extends CoreEntity {
  // ???

  @PrimaryColumn()
  userkey: number;

  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn()
  dress_id: number;

  @Column({ type: 'boolean', default: false })
  is_main: boolean;
}
