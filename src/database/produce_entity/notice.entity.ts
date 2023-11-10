import { DeployableEntity } from 'src/common/entities/deployable.entity';
import { LocalDateTimeTransformer } from 'src/util/time-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { NoticeDetail } from './notice-detail.entity';

@Entity()
@Unique(['project_id', 'notice_name'])
export class Notice extends DeployableEntity {
  @PrimaryGeneratedColumn()
  notice_id: number;

  @Column()
  project_id: number;

  @Column({ length: 30 })
  notice_name: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    comment: '게시 시작일시',
    transformer: new LocalDateTimeTransformer(),
  })
  from_date: Date;

  @Column({
    default: '9999-12-31',
    comment: '게시 종료일시',
    transformer: new LocalDateTimeTransformer(),
  })
  to_date: Date;

  @Column({ length: 30, default: '' })
  exception_culture: string;

  @Column({ length: 20, default: 'all' })
  os: string;

  @Column({ default: 0 })
  sortkey: number;

  @Column({ type: 'boolean', default: true })
  is_public: boolean;

  @OneToMany((t) => NoticeDetail, (d) => d.notice, {
    eager: true,
    cascade: true,
  })
  details: NoticeDetail[];
}
