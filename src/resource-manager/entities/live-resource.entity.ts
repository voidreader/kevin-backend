import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import { Column, Entity, Unique } from 'typeorm';
import { IsEnum } from 'class-validator';
import { VisualResourceType } from 'src/common/entities/common-image-resource.entity';

//* Live Objec,t Live Illust, Live BG 엔터티

@Entity()
@Unique(['project_id', 'live_type', 'live_name'])
export class LiveResource extends CoreDeployEntity {
  @Column({ default: 0 })
  project_id: number; // 연결 프로젝트 ID

  @Column({ type: 'enum', enum: VisualResourceType })
  @IsEnum(VisualResourceType)
  live_type: string;

  @Column({ length: 30 })
  live_name: string;

  @Column({ default: 1 })
  game_scale: number;

  @Column({ default: 0, type: 'float', comment: '위치 오프셋 X좌표' })
  offset_x: number;

  @Column({ default: 0, type: 'float', comment: '위치 오프셋 X좌표' })
  offset_y: number;

  @Column({ default: false, type: 'boolean' })
  is_public: boolean; // 공개 여부(앨범, 메모리 등)

  @Column({ nullable: true, length: 30 })
  speaker: string; // 연관 등장인물 이름

  @Column({ default: 1 })
  resource_ver: number;

  @Column({ default: -1 })
  appear_episode: number;

  @Column({ length: 160, nullable: true })
  thumbnail_url: string;
  @Column({ length: 120, nullable: true })
  thumbnail_key: string;
  @Column({ length: 30, nullable: true })
  bucket: string;
}
