import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProfileLine } from './profile-line.entity';

// * 프로필 대사 다국어 지원 테이블

@Unique(['profileLine', 'lang'])
@Entity()
export class ProfileLineLang extends CoreEntity {
  @Column({ length: 10 })
  lang: string;

  @Column({ length: 120 })
  line_text: string;

  @ManyToOne((t) => ProfileLine, (line) => line.localizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'line_id' })
  profileLine: ProfileLine;
}
