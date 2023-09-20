import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { DlcMaster } from './dlc-master.entity';

@Entity()
@Unique(['master', 'lang'])
export class DlcDetail extends CoreEntity {
  @Column({ length: 10 })
  lang: string;

  @Column({ nullable: true, length: 120 })
  title: string;
  @Column({ nullable: true, length: 300 })
  summary: string;

  @Column({ nullable: true, length: 160 })
  banner_url: string;
  @Column({ nullable: true, length: 120 })
  banner_key: string;
  @Column({ nullable: true, length: 40 })
  banner_bucket: string;

  @ManyToOne((t) => DlcMaster, (master) => master.details, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'dlc_id' })
  master: DlcMaster;
}
