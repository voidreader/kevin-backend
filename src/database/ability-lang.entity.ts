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
import { Ability } from './produce_entity/ability.entity';

// * 능력 다국어 테이블

@Entity()
export class AbilityLang extends CoreEntity {
  @Column({ length: 10 })
  lang: string;

  @Column({ length: 30 })
  ability_name: string;

  @ManyToOne((t) => Ability, (a) => a.localizations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ability_id' })
  ability: Ability;
}
