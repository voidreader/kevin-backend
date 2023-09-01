import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class DeployableEntity {
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
