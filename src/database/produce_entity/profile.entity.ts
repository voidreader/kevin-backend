import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import { Column, Entity, Unique } from 'typeorm';

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

  @Column({ comment: '생년월일' })
  profile_birth_date: Date;

  @Column({ comment: '좋아하는것 text_id', default: -1 })
  profile_favorite_id: number;

  @Column({ comment: '싫어하는것 text_id', default: -1 })
  profile_hate_id: number;

  @Column({ comment: '기본 한 줄 대사 text_id', default: -1 })
  profile_line_id: number;

  @Column({ comment: '소개글 text_id', default: -1 })
  profile_introduce_id: number;
}
