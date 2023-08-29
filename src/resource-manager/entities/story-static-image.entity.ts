import { CommonImageResourceEntity } from 'src/common/entities/common-image-resource.entity';
import { Entity, JoinColumn, OneToMany, OneToOne, Unique } from 'typeorm';
import { ImageLocalization } from './image-localization.entity';
import { PublicExtension } from './public-extension.entity';

// 작품의 일반 이미지 리소스
// 미니컷, 배경, 일러스트가 동일한 형태의 Entity를 사용한다.

@Entity()
@Unique(['project_id', 'image_type', 'image_name'])
@Unique(['id', 'image_type'])
export class StoryStaticImage extends CommonImageResourceEntity {
  @OneToOne(() => PublicExtension, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'extension_id' })
  extension: PublicExtension;

  @OneToMany(() => ImageLocalization, (local) => local.image, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  localizations: ImageLocalization[];
}
