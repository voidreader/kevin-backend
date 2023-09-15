import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';
import { Episode } from './episode.entity';

@Entity()
export class EpisodeExtension extends CoreEntity {
  @Column({ length: 160, nullable: true })
  banner_url: string;
  @Column({ length: 120, nullable: true })
  banner_key: string;
  @Column({ length: 30, nullable: true })
  bucket: string;
}
