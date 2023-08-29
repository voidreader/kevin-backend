import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

// * 앨범, 갤러리 등에 공개되는 리소스에서 사용

@Entity()
export class PublicExtension extends CoreEntity {
  @Column({ length: 160, nullable: true })
  thumbnail_url: string;
  @Column({ length: 120, nullable: true })
  thumbnail_key: string;
  @Column({ length: 30, nullable: true })
  bucket: string;

  @Column({ default: -1 })
  appear_episode: number;
}
