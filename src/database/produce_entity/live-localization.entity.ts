import { IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  Unique,
} from 'typeorm';

import { VisualResourceType } from 'src/common/entities/common-image-resource.entity';
import { LiveResource } from 'src/resource-manager/entities/live-resource.entity';

// * 라이브 오브젝트, 일러스트 리소스 로컬라이징 정보

@Entity()
@Unique(['live', 'lang'])
export class LiveLocalization extends CoreEntity {
  @Column({ length: 10 })
  lang: string;

  @Column({ length: 60, default: '-' })
  public_name: string;

  @Column({ length: 500, default: '-' })
  summary: string;

  @ManyToOne(
    (t) => LiveResource,
    (liveResource) => liveResource.localizations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'live_id' })
  live: LiveResource;
}
