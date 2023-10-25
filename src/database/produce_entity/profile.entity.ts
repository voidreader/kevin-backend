import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { Ability } from './ability.entity';
import { ProfileLine } from './profile-line.entity';
import { ProfileLang } from './profile-lang.entity';

// * 캐릭터 프로파일
@Entity()
@Unique(['project_id', 'speaker'])
export class Profile extends CoreDeployEntity {
  @Column({ default: 0 })
  project_id: number; // 연결 프로젝트 ID

  @Column({ length: 30, comment: '연결 등장인물' })
  speaker: string;

  @Column({ type: 'float', comment: '키', default: 0 })
  profile_height: number;

  @Column({ comment: '나이', default: 0 })
  profile_age: number;

  @Column({ comment: '생년월일', default: null, nullable: true })
  profile_birth_date: Date;

  // 프로필 : 좋아하는것, 싫어하는것, 소개, 기타
  profile_favorite: number; // 마이그레이션용 컬럼
  profile_dislike: number;
  profile_introduce: number;
  profile_etc: number;

  // 프론트엔드를 위한 컬럼
  favorite_localizations: ProfileLang[];
  dislike_localizations: ProfileLang[];
  introduce_localizations: ProfileLang[];
  etc_localizations: ProfileLang[];

  @Column({
    type: 'boolean',
    comment: '메인캐릭터 여부. 프로필 생성과 연계',
    default: false,
  })
  is_main: boolean;

  @Column({ type: 'boolean', comment: '스탠딩 사용 여부', default: false })
  use_standing: boolean;

  @Column({ type: 'boolean', comment: '이모티콘 사용 여부', default: false })
  use_emoticon: boolean;

  @OneToMany((type) => Ability, (ability) => ability.profile, {
    eager: true,
    cascade: true,
  })
  abilities: Ability[];

  @OneToMany((type) => ProfileLine, (line) => line.profile, {
    eager: true,
    cascade: true,
  })
  lines: ProfileLine[];

  @OneToMany((type) => ProfileLang, (p) => p.profile, {
    eager: true,
    cascade: true,
  })
  localizations: ProfileLang[];
}
