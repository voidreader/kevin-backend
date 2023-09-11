import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Emoticon } from './emoticon.entity';

@Entity()
@Unique(['master', 'image_name'])
export class EmoticonSlave extends CoreEntity {
  @Column({ length: 30 })
  image_name: string;

  @Column({ length: 160, nullable: true, comment: '야이템 상세 이미지' })
  image_url: string;
  @Column({ length: 120, nullable: true })
  image_key: string;
  @Column({ length: 30, nullable: true })
  image_bucket: string;

  @ManyToOne((t) => Emoticon, (e) => e.slaves)
  @JoinColumn({ name: 'master_id' })
  master: Emoticon;
}
