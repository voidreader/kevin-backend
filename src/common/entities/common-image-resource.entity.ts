import { Column } from 'typeorm';
import { CoreDeployEntity } from './core-deploy.entity';
import { IsEnum } from 'class-validator';

// 정적 이미지 리소스 타입
export enum ImageResourceType {
  minicut = 'minicut',
  bg = 'bg',
  illust = 'illust',
}

// * 일반 이미지 리소스 Entity
export class CommonImageResourceEntity extends CoreDeployEntity {
  @Column({ default: 0 })
  project_id: number; // 연결 프로젝트 ID

  @Column({ type: 'enum', enum: ImageResourceType })
  @IsEnum(ImageResourceType)
  image_type: string;

  @Column({ length: 30 })
  image_name: string;
  @Column({ length: 160 })
  image_url: string;
  @Column({ length: 120 })
  image_key: string;
  @Column({ length: 30 })
  bucket: string;

  @Column({ default: 1 })
  game_scale: number;
  @Column({ default: 0 })
  sortkey: number;

  @Column({ default: false })
  is_public: boolean; // 공개 여부(앨범, 메모리 등)

  @Column({ nullable: true, length: 30 })
  speaker: string; // 연관 등장인물 이름
}
