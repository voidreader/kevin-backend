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
@Unique(['loading', 'episode_id'])
export class LoadingEpisode extends CoreEntity {
  @Column()
  episode_id: number;

  @Column({ type: 'boolean', default: true })
  is_use: boolean;

  @ManyToOne((type) => Loading, (l) => l.episodes)
  @JoinColumn({ name: 'loading_id' })
  loading: Loading;
}
