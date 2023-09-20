import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity({ database: 'game' })
@Unique(['userkey'])
export class UserPackageMission extends CoreEntity {
  @Column()
  userkey: number;

  @Column({ type: 'boolean', default: 0, comment: '트위터 SNS 진입 여부' })
  twitter_mission: boolean;
  @Column({ type: 'boolean', default: 0, comment: '리뷰 페이지 진입 여부' })
  review_mission: boolean;
}
