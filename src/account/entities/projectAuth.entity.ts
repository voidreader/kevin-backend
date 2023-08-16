import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Account } from './account.entity';

// * 사용자 계정별 프로젝트 권한

@Entity()
@Unique(['account', 'project_id'])
export class ProjectAuth extends CoreEntity {
  @Column()
  project_id: number;

  @Column({ default: 'update' })
  auth_kind: string;

  @ManyToOne((type) => Account, (account) => account.projectAuths, {
    onDelete: 'CASCADE',
  })
  account: Account;
}
