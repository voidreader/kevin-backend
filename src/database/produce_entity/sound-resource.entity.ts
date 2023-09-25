import { IsEnum, Max, Min } from 'class-validator';
import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import { Column, Entity, Index, Unique } from 'typeorm';

export enum SoundResourceType {
  voice = 'voice',
  se = 'se',
  bgm = 'bgm',
}

@Entity()
@Unique(['project_id', 'sound_name'])
@Index(['project_id', 'sound_type', 'sound_name'])
export class SoundResource extends CoreDeployEntity {
  @Column({ default: 0 })
  project_id: number; // 연결 프로젝트 ID

  @Column({ type: 'enum', enum: SoundResourceType })
  @IsEnum(SoundResourceType)
  sound_type: string;

  @Column({ length: 30 })
  sound_name: string;
  @Column({ length: 160 })
  sound_url: string;
  @Column({ length: 120 })
  sound_key: string;
  @Column({ length: 30 })
  bucket: string;

  @Column({ type: 'float', default: 1 })
  @Max(1)
  @Min(0)
  game_volume: number;

  @Column({ default: false, type: 'boolean' })
  is_public: boolean; // 공개 여부(앨범, 메모리 등)

  @Column({ nullable: true, length: 30 })
  speaker: string; // 연관 등장인물 이름
}
