import { Column, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

export class DeployEntity {
  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
