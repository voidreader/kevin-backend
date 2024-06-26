import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

// * 캐릭터별 의상 정보

@Entity()
@Unique(['project_id', 'speaker', 'model_id'])
@Unique(['project_id', 'speaker', 'dress_name'])
export class Dress {
  @PrimaryGeneratedColumn()
  dress_id: number;

  @Column({ length: 30, comment: '의상 이름' })
  dress_name: string;

  @Column()
  project_id: number;

  @Column({ length: 20, comment: '의상 소유자', default: null })
  speaker: string;

  @Column({ comment: '연결 모델 ID', nullable: true })
  @Index()
  model_id: number;

  model_name: string; // 모델 id와 연결된 모델 이름

  @Column({ comment: '기본 의상 여부', type: 'boolean', default: false })
  is_default: boolean;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
