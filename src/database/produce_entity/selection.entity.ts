import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['episode_id', 'selection_group', 'selection_no'])
export class Selection {
  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn()
  episode_id: number;

  @PrimaryColumn({ default: 0, comment: '선택지 식별자 group' })
  selection_group: number;

  @PrimaryColumn({ default: 0, comment: '선택지 식별자 no' })
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

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
