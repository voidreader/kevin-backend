import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// * 작품별 광고설정

@Entity()
export class AdSetting {
  @PrimaryColumn()
  project_id: number;

  @Column({
    type: 'boolean',
    comment: '에피소드 로딩 광고 활성화',
    default: false,
  })
  loading_is_active: number;

  @Column({
    type: 'tinyint',
    comment: '로딩 전면 광고 등장 백분율',
    default: 50,
  })
  loading_interstitial: number;

  @Column({
    type: 'tinyint',
    comment: '로딩 동영상 광고 등장 백분율',
    default: 50,
  })
  loading_rewarded: number;

  @Column({
    type: 'boolean',
    comment: '인게임 배너 광고 활성화',
    default: false,
  })
  banner_is_active: number;

  @Column({
    type: 'boolean',
    comment: '인게임 플레이 광고 활성화',
    default: false,
  })
  play_is_active: number;

  @Column({
    type: 'tinyint',
    comment: '인게임 플레이 광고가 나올때까지 필요한 스크립트 라인',
    default: 120,
  })
  play_line: number;

  @Column({
    type: 'tinyint',
    comment: '인게임 광고 등장 확률 Max:100',
    default: 100,
  })
  play_percent: number;

  @Column({
    type: 'tinyint',
    comment: '인게임 전면광고 등장 백분율',
    default: 100,
  })
  play_interstitial: number;

  @Column({
    type: 'tinyint',
    comment: '인게임 영상광고 등장 백분율',
    default: 0,
  })
  play_rewarded: number;

  @Column({
    type: 'boolean',
    comment: '선택지 후 광고 활성화 여부',
    default: false,
  })
  selection_is_active: number;

  @Column({
    type: 'tinyint',
    comment: '선택지 후 전면광고 백분율',
    default: 100,
  })
  selection_interstitial: number;

  @Column({ type: 'tinyint', comment: '선택지 후 영상광고 백분율', default: 0 })
  selection_rewarded: number;
}
