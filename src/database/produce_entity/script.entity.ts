import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index('idx_el', ['episode_id', 'lang'])
@Index('idx_pel', ['project_id', 'episode_id', 'lang'])
export class Script {
  // * sheet와의 연동때문에 null을 사용하지 않음. (일부 숫자 타입 예외)

  @PrimaryGeneratedColumn({ type: 'bigint' })
  script_no: string;

  @Column()
  project_id: number;

  @Column()
  episode_id: number;

  @Column({ default: null, comment: '사건ID', nullable: true })
  scene_id: number;

  @Column({ default: '', length: 20, comment: 'template code' })
  template: string;

  @Column({ default: '', length: 20, comment: '캐릭터, 화자' })
  speaker: string;

  @Column({ default: '', length: 240 })
  script_data: string;

  @Column({
    default: null,
    comment: '이동할 사건ID 혹은 에피소드ID',
    length: 20,
  })
  target_scene_id: string;

  @Column({ default: '', length: 300, comment: '필요조건' })
  requisite: string;

  @Column({ default: '', length: 30, comment: '캐릭터 모션' })
  character_expression: string;

  @Column({ default: '', length: 30, comment: '이모티콘' })
  emoticon_expression: string;

  @Column({ default: '', length: 20, comment: '등장 효과' })
  in_effect: string;

  @Column({ default: '', length: 20, comment: '퇴장 효과' })
  out_effect: string;

  @Column({ nullable: true, comment: '말풍선 사이즈 1-4' })
  bubble_size: number;

  @Column({ nullable: true, comment: '말풍선 위치 1-9' })
  bubble_pos: number;

  @Column({ nullable: true, comment: '말풍선 유지' })
  bubble_hold: number;

  @Column({ nullable: true, comment: '말꼬리 반전' })
  bubble_reverse: number;

  @Column({ nullable: true, comment: '이모티콘 사이즈 1-4' })
  emoticon_size: number;

  @Column({ default: '', length: 30, comment: 'Voice 이름' })
  voice: string;

  @Column({ default: 0, comment: '자동 진행 Row' })
  autoplay_row: number;

  @Column({ default: '', length: 20, comment: '효과음 이름' })
  sound_effect: string;

  @Column({ length: 10, comment: '언어 코드' })
  lang: string;

  @Column({ default: '', length: 100, comment: '제어 변수' })
  control: string;

  @Column({ default: 0, comment: '선택지 식별자 group' })
  selection_group: number;

  @Column({ default: 0, comment: '선택지 식별자 no' })
  selection_no: number;

  @Column({
    default: '',
    length: 200,
    comment: '개발자 코멘트',
  })
  dev_comment: string;
}
