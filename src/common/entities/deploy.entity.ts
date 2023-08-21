import { Column } from 'typeorm';

export class DeployEntity {
  @Column({ select: false, default: true })
  isUpdated: boolean; // 컨텐츠 배포 이후 수정 발생 여부

  @Column({ select: false, nullable: true })
  lastDeployedAt: Date; // 마지막 배포 시간
}
