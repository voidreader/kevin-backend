import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Profile } from './profile.entity';

// * 캐릭터별 능력치&호감도 Entity

@Entity()
@Unique(['profile', 'ability_name'])
export class Ability {
  @PrimaryGeneratedColumn()
  ability_id: number;

  @Column({ length: 30, comment: '스크립트 편집에서 사용되는 이름' })
  ability_name: string;

  @Column({ default: 0, comment: '대상 능력 최소값' })
  min_value: number;

  @Column({ default: 100, comment: '대상 능력 최대값' })
  max_value: number;
  @Column({ type: 'boolean', default: true, comment: '메인 능력 여부' })
  is_main: boolean;

  // icon
  @Column({ length: 160, nullable: true })
  icon_url: string;
  @Column({ length: 120, nullable: true })
  icon_key: string;
  @Column({ length: 30, nullable: true })
  bucket: string;

  //
  @Column({ default: -1, comment: '능력 이름의 로컬라이즈 텍스트ID' })
  local_id: number; // localizations

  // Profile 과의 관계 설정
  @ManyToOne((type) => Profile, (profile) => profile.abilities)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;
}
