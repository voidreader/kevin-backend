import { CoreEntity } from 'src/common/entities/core.entity';
import { LocalDateTimeTransformer } from 'src/util/time-transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['project_id', 'data_type'])
export class DeployHistory extends CoreEntity {
  @Column({})
  project_id: number;

  @Column({ comment: '배포 데이터 타입' })
  data_type: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    comment: '마지막 배포일시',
    transformer: new LocalDateTimeTransformer(),
  })
  last_deploy_at: Date;
}
