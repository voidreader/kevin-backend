import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class ModelSlave {
  @PrimaryGeneratedColumn()
  model_slave_id: number;

  @Column({ length: 160 })
  file_url: string;

  @Column({ length: 120 })
  file_key: string;

  @Column({ length: 120 })
  file_name: string;

  @Column({ type: 'boolean', default: false, comment: '모션 설정 가능 여부' })
  is_motion: boolean;

  @Column({ length: 30, nullable: true, comment: '모션 이름' })
  motion_name: string;

  @Column({ default: 10 })
  sortkey: string;

  @ManyToOne((t) => Model, (model) => model.slaves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'model_id' })
  model: Model;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
