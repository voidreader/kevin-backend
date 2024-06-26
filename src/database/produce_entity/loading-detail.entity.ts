import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Loading } from './loading.entity';

@Entity()
export class LoadingDetail extends CoreEntity {
  @Column({ length: 20 })
  lang: string;

  @Column({ length: 160 })
  loading_text: string;

  @ManyToOne((type) => Loading, (l) => l.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loading_id' })
  loading: Loading;
}
