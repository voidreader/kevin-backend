import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Package } from './package.entity';

// * 패키지 클라이언트

@Entity()
@Unique(['package', 'os_type', 'client_version', 'app_store'])
export class PackageClient extends CoreEntity {
  @Column({ length: 20 })
  os_type: string;

  @Column({ length: 20 })
  client_version: string;

  @Column({ length: 20 })
  client_status: string;

  @Column({ length: 160, nullable: true })
  custom_url: string;

  @Column({ length: 20 })
  app_store: string;

  @Column({ length: 120, nullable: true })
  memo: string;

  @ManyToOne((type) => Package, (p) => p.clients)
  @JoinColumn({ name: 'package_id' })
  package: Package;
}
