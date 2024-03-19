import { IsEnum } from 'class-validator';
import { DeployableEntity } from 'src/common/entities/deployable.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EpisodeDetail } from './episode-detail.entity';
import { EpisodeExtension } from './episode-extension.entity';

// 에피소드 타입
export enum EpisodeTypeEnum {
  chapter = 'chapter',
  ending = 'ending',
  side = 'side',
}

// 엔딩 타입
export enum EndingTypeEnum {
  final = 'final',
  hidden = 'hidden',
  none = 'none',
}

// 에피소드 해금 스타일
export enum UnlockStyleEnum {
  episode = 'episode',
  scene = 'scene',
  none = 'none',
  coupon = 'coupon',
}

@Entity()
@Index(['project_id', 'episode_type', 'chapter_number'])
@Index(['project_id', 'dlc_id', 'chapter_number'])
export class Episode extends DeployableEntity {
  @PrimaryGeneratedColumn()
  episode_id: number;

  @Column({ comment: '소속 프로젝트 ID' })
  project_id: number;

  @Column({ type: 'enum', enum: EpisodeTypeEnum })
  // @IsEnum(EpisodeTypeEnum)
  episode_type: EpisodeTypeEnum;

  @Column({ length: 60 })
  title: string;

  indexed_title: string;

  @Column({ length: 30, comment: '에피소드 상태', default: 'draft' })
  episode_status: string;

  @Column({
    type: 'enum',
    enum: EndingTypeEnum,
    comment: '엔딩 타입 - 엔딩의 경우만 사용',
    default: EndingTypeEnum.none,
  })
  ending_type: EndingTypeEnum;

  @Column({
    type: 'enum',
    enum: UnlockStyleEnum,
    comment: '해금 스타일',
    default: UnlockStyleEnum.none,
  })
  unlock_style: UnlockStyleEnum;

  @Column({ comment: '해금 조건', nullable: true, default: null })
  unlock_by: number;

  @Column({ comment: '종속된 에피소드ID', default: -1 })
  depend_episode: number;

  @Column({ default: 0, comment: '에피소드 순번' })
  chapter_number: number;

  @Column({
    length: 30,
    nullable: true,
    comment: '연결 등장인물',
    default: null,
  })
  speaker: string;

  @Column({ comment: '연결된 DLC ID', default: -1 })
  dlc_id: number;

  @Column({ default: -1, comment: '구 제작시스템 ID' })
  old_episode_id: number;

  @OneToMany(
    (type) => EpisodeDetail,
    (episodeDetail) => episodeDetail.episode,
    { eager: true, cascade: true },
  )
  localizations: EpisodeDetail[];

  @OneToOne(() => EpisodeExtension, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'extension_id' })
  extension: EpisodeExtension;
}
