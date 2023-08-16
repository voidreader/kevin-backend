import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from './account.entity';

@Entity()
export class Verification extends CoreEntity {
  @Column()
  code: string; // 인증코드

  @OneToOne((type) => Account, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: Account;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
