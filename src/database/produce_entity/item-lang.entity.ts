import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity()
@Unique(['item', 'lang'])
export class ItemLang extends CoreEntity {
  @Column({ length: 10 })
  lang: string;

  @Column({ nullable: true, length: 60 })
  item_name: string;

  @ManyToOne((type) => Item, (item) => item.localizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id' })
  item: Item;
}
