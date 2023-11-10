import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Notice } from './notice.entity';

@Entity()
@Unique(['notice', 'lang'])
export class NoticeDetail extends CoreEntity {
  @Column({ length: 10 })
  lang: string;

  @Column({ length: 40 })
  title: string;

  @Column({ length: 1200, default: '' })
  contents: string;

  @Column({ length: 160, nullable: true, comment: '배너 이미지' })
  banner_url: string;
  @Column({ length: 120, nullable: true })
  banner_key: string;
  @Column({ length: 30, nullable: true })
  banner_bucket: string;

  @Column({ length: 160, nullable: true, comment: '상세 이미지' })
  detail_url: string;

  @Column({ length: 120, nullable: true })
  detail_key: string;
  @Column({ length: 30, nullable: true })
  detail_bucket: string;

  @Column({ length: 200, nullable: true })
  url_link: string;

  @ManyToOne((type) => Notice, (notice) => notice.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'notice_id' })
  notice: Notice;
}
