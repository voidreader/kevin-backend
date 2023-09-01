import { Column } from 'typeorm';
import { CoreEntity } from './core.entity';

export class CoreDeployEntity extends CoreEntity {
  @Column({ select: false, default: true, type: 'boolean' })
  is_updated: boolean; // 컨텐츠 배포 이후 수정 발생 여부

  @Column({ select: false, nullable: true })
  last_deployed_at: Date; // 마지막 배포 시간
}
