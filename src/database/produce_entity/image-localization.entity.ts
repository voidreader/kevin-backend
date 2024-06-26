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
import { StoryStaticImage } from './story-static-image.entity';

// * 이미지 리소스 로컬라이징 정보

@Entity()
export class ImageLocalization extends CoreEntity {
  @Column({ length: 10 })
  lang: string;

  @Column({ length: 60, default: '-' })
  public_name: string;

  @Column({ length: 500, default: '-' })
  summary: string;

  @ManyToOne(
    () => StoryStaticImage,
    (staticImage) => staticImage.localizations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([{ name: 'resource_id' }])
  image: StoryStaticImage;
}
