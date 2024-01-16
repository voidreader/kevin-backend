import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Profile } from './profile.entity';

// * 프로필에서 사용되는 다국어 지원 텍스트 정보

@Unique(['profile', 'text_type', 'lang'])
@Entity()
export class ProfileLang extends CoreEntity {
  @Column({ comment: '프로필 ID' })
  profile_id: number;

  @Column({ length: 20 })
  lang: string;

  @Column({ length: 20, comment: '텍스트 타입' })
  text_type: string;

  @Column({ length: 120, comment: '내용' })
  profile_text: string;

  @Column({ length: 120, comment: '레이블 텍스트', default: 'required' })
  label_text: string;

  @ManyToOne((type) => Profile, (p) => p.localizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;
}
