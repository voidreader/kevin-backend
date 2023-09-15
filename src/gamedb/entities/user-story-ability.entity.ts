import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

// * 유저가 스토리 진행하면서 얻게 되는 능력 수치

@Entity()
@Index(['userkey', 'project_id', 'episode_id'])
@Index(['userkey', 'ability_id'])
export class UserStoryAbility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userkey: number;

  @Column()
  project_id: number;

  @Column()
  episode_id: number;

  @Column({ nullable: true })
  scene_id: number;

  @Column()
  ability_id: number;

  @Column({ default: 0, comment: '획득 수치' })
  add_value: number;

  @CreateDateColumn({ select: false })
  created_at: Date;
}
