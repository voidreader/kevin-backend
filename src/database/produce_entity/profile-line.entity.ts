import { CoreEntity } from 'src/common/entities/core.entity';
import { Profile } from './profile.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProfileLineLang } from './profile-line-lang.entity';

// * 캐릭터 프로필 대사

@Entity()
@Index(['profile'])
export class ProfileLine extends CoreEntity {
  @Column({
    default: -1,
    comment: '연결된 현지화 text_id. lang 테이블 생성 후 사용하지 않음',
  })
  text_id: number;

  @Column({ comment: '프로필과 연결된 캐릭터의 모션 이름', length: 30 })
  motion_name: string;

  @Column({ default: 0 })
  condition_type: number;

  @Column({ nullable: true, length: 80 })
  line_condition: string;

  @Column({ nullable: true, length: 30 })
  sound_name: string;

  @ManyToOne((type) => Profile, (profile) => profile.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany((t) => ProfileLineLang, (lang) => lang.profileLine, {
    eager: true,
    cascade: true,
  })
  localizations: ProfileLineLang[];
}
