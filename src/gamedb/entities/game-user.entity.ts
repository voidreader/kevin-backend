import { IsEnum } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum osTypeEnum {
  iOS = 'iOS',
  Android = 'Android',
  Editor = 'Editor',
  Web = 'Web',
}

@Entity({ database: 'game' })
@Unique(['thirdparty_id', 'project_id'])
@Index(['device_id', 'project_id'])
export class GameUser {
  @PrimaryGeneratedColumn()
  userkey: number;

  @Column({ length: 4 })
  pincode: string;

  @Column({
    length: 20,

    comment: 'pincode + userkey 조합',
    nullable: true,
  })
  uid: string;

  @Column({ length: 20, comment: '게임내 사용 닉네임', nullable: true })
  nickname: string;

  @Column({ default: 30, comment: '주 재화 보유 수량' })
  prime_currency: number;

  @Column({ length: 128, comment: 'Device 식별자', default: '-' })
  device_id: string; // 디바이스 ID

  @Column({ length: 128, comment: '타사 연결 id' })
  thirdparty_id: string; // 연결된 타사 인증 id (뒤끝 or 유니티)

  @Column({
    length: 128,
    comment: '구글 계정 id',
    nullable: true,
    default: null,
  })
  google_id: string;
  @Column({
    length: 128,
    comment: '애플 계정 id',
    nullable: true,
    default: null,
  })
  apple_id: string;

  @Column({
    type: 'enum',
    enum: osTypeEnum,
  })
  @IsEnum(osTypeEnum)
  os: osTypeEnum; // 유저 접속 플랫폼

  @Column({ length: 4, comment: '현재 사용중인 언어' })
  current_lang: string;

  @Column({ length: 4, comment: '현재 문화권' })
  current_culture: string;

  @Column({ length: 4, comment: '국가' })
  country: string;

  @Column({ length: 30, comment: '계정이 생성된 bundle_id' })
  bundle_id: string;

  @Column({ comment: '계정이 생성된 project_id' })
  project_id: number;

  @Column({ length: 10, comment: '현재 사용중인 클라이언트 버전' })
  client_ver: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  // 탈퇴 일시
  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
