import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'game' })
export class UserVisualCollection {
  @PrimaryColumn()
  userkey: number;

  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn({
    comment: '리소스 타입(minicut,illust,live_object,live_illust',
  })
  visual_type: string;

  @PrimaryColumn({ comment: '대상 리소스 ID' })
  resource_id: number;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
