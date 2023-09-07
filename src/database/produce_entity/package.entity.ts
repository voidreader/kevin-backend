import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PackageClient } from './package-client.entity';

// * 패키지 마스터
@Entity()
export class Package {
  @PrimaryColumn({ length: 20 })
  package_id: string;
  @Column({ length: 40 })
  package_name: string;

  @Column({ length: 40, nullable: true, comment: '스토어 ID' })
  bundle_id: string;

  @Column({ length: 160, nullable: true, comment: '설치 URL' })
  install_url: string;

  @Column({ length: 160, nullable: true, comment: '테스트 서버 URL' })
  test_server_url: string;

  @Column({ length: 160, nullable: true, comment: '검수 서버 URL' })
  review_server_url: string;

  @Column({ length: 160, nullable: true, comment: '라이브 서버 URL' })
  live_server_url: string;

  @Column()
  @Index()
  project_id: number;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @OneToMany((t) => PackageClient, (pc) => pc.package)
  clients: PackageClient[];
}
