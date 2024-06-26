import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Episode } from './episode.entity';

@Entity()
@Unique(['episode', 'lang'])
export class EpisodeDetail extends CoreEntity {
  @Column({ length: 10 })
  lang: string;

  @Column({ nullable: true, length: 60, default: '-' })
  title: string;

  @Column({ nullable: true, length: 400, default: '-' })
  summary: string;

  @ManyToOne((type) => Episode, (episode) => episode.localizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'episode_id' })
  episode: Episode;
}
