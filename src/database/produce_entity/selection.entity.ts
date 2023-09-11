import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Selection {
  @Column()
  project_id: number;

  @Column()
  episode_id: number;

  @Column({ default: 0, comment: '선택지 식별자 group' })
  selection_group: number;

  @Column({ default: 0, comment: '선택지 식별자 no' })
  selection_no: number;

  @Column({ length: 200, nullable: true })
  KO: string;
  @Column({ length: 200, nullable: true })
  EN: string;
  @Column({ length: 200, nullable: true })
  JA: string;
  @Column({ length: 200, nullable: true })
  AR: string;
  @Column({ length: 200, nullable: true })
  ID: string;
  @Column({ length: 200, nullable: true })
  ES: string;
  @Column({ length: 200, nullable: true })
  MS: string;
  @Column({ length: 200, nullable: true })
  RU: string;
  @Column({ length: 200, nullable: true })
  ZH: string;
  @Column({ length: 200, nullable: true })
  SC: string;
}
