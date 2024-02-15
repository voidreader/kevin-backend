import { CoreEntity } from 'src/common/entities/core.entity';
import { LiveResource } from './live-resource.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['parent', 'file_key'])
export class LiveResourceDetail extends CoreEntity {
  @Column({ length: 160 })
  file_url: string;

  @Column({ length: 160 })
  file_key: string;

  @Column({ length: 120 })
  file_name: string;

  @Column({ length: 30 })
  bucket: string;

  @Column({ length: 30, nullable: true })
  motion_name: string;

  @ManyToOne((type) => LiveResource, (liveResource) => liveResource.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resource_id' })
  parent: LiveResource;

  resource_id: number;
}
