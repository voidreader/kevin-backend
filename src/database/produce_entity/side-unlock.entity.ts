import { IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, Unique } from 'typeorm';

export enum SideUnlockType {
  ability = 'ability', // 특정 ability 일정 수치 달성
  allAbilityClear = 'allAbilityClear', // 모든 디폴트 능력 일정 수치 달성
  allItem = 'allItem', // 모든 아이템 수집
}

@Entity()
@Unique(['project_id', 'unlock_type', 'target_id', 'target_percent'])
export class SideUnlock extends CoreEntity {
  @Column()
  project_id: number;

  @Column({
    type: 'enum',
    enum: SideUnlockType,
    comment: '해금 타입',
  })
  @IsEnum(SideUnlockType)
  unlock_type: string; // 해금타입

  @Column({
    nullable: true,
    default: null,
    comment: '해금타입에 따라 필요한 추가 ID (능력ID 등)',
  })
  target_id: number; // 해금타입에 따라 필요한 추가 ID (능력ID 등)

  @Column({ comment: '목표 달성 수치 백분율', default: 100 })
  target_percent: number;

  @Column()
  episode_id: number;
}
