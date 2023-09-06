import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { LoadingEpisode } from './loading-episode.entity';
import { LoadingDetail } from './loading-detail.entity';

@Entity()
export class Loading extends CoreDeployEntity {
  @Column({ default: 0 })
  project_id: number;

  @Column({ length: 30 })
  image_name: string;
  @Column({ length: 160 })
  image_url: string;
  @Column({ length: 120 })
  image_key: string;
  @Column({ length: 30 })
  bucket: string;

  @Column({ length: 30 })
  loading_name: string;

  @Column({ default: false, type: 'boolean' })
  is_public: boolean;

  @OneToMany((type) => LoadingEpisode, (l) => l.loading)
  episodes: LoadingEpisode[];

  @ManyToOne((type) => LoadingDetail, (l) => l.loading)
  details: LoadingDetail[];
}
