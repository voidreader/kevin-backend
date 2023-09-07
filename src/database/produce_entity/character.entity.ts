import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

// 작품속 캐릭터 리스트

@Entity()
export class Character {
  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn({ length: 20 })
  speaker: string;

  @Column({ type: 'boolean', comment: '메인캐릭터 여부. 프로필 생성과 연계' })
  is_main: boolean;

  @Column({ type: 'boolean', comment: '스탠딩 사용 여부' })
  use_standing: boolean;

  @Column({ type: 'boolean', comment: '이모티콘 사용 여부' })
  use_emoticon: boolean;

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
