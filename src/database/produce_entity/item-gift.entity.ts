import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity()
@Index(['item_id', 'profile_id', 'ability_id'])
@Index(['profile_id', 'ability_id'])
export class ItemGift extends CoreEntity {
  @Column({ comment: '사용된 아이템 식별자' })
  item_id: number;

  @Column({ comment: '사용된 아이템 수량' })
  used_quantity: number;

  @Column({ comment: '선물 받는 대상 프로필 캐릭터' })
  profile_id: number;

  @Column({ comment: '대상이 되는 ability_id' })
  ability_id: number;

  @Column({ comment: '능력 증감 수치' })
  ability_value: number;
}
