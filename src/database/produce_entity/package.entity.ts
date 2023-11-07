import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PackageClient } from './package-client.entity';
import { PackageAd } from './package-ad.entity';

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

  @Column({ length: 120, nullable: true, comment: '개인정보처리방침 URL' })
  privacy_url: string;

  @Column({ length: 120, nullable: true, comment: '이용약관 URL' })
  terms_url: string;

  @Column({ length: 120, nullable: true, comment: '저작권 URL' })
  copyright_url: string;

  @Column({ default: 1, comment: '로컬라이징 텍스트 버전' })
  text_version: number;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  created_at: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @OneToMany((t) => PackageClient, (pc) => pc.package, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  clients: PackageClient[];

  @OneToOne(() => PackageAd, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ad_id' })
  ad: PackageAd;
}
