import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { CoreEntity } from './core.entity';
import { DeployEntity } from './deploy.entity';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

// * 로컬라이즈 텍스트
export class textLocalize extends IntersectionType(
  OmitType(CoreEntity, ['id']),
  DeployEntity,
) {
  @PrimaryGeneratedColumn()
  text_id: number;

  @Column({ length: 20 })
  category: string;

  @Column({ length: 300, default: '-' })
  KO: string;
  @Column({ length: 300, default: '-' })
  EN: string;
  @Column({ length: 300, default: '-' })
  JA: string;
  @Column({ length: 300, default: '-' })
  AR: string;
  @Column({ length: 300, default: '-' })
  ID: string;
  @Column({ length: 300, default: '-' })
  ES: string;
  @Column({ length: 300, default: '-' })
  MS: string;
  @Column({ length: 300, default: '-' })
  RU: string;
  @Column({ length: 300, default: '-' })
  ZH: string;
  @Column({ length: 300, default: '-' })
  SC: string;

  @Column({ length: 150, default: '-' })
  memo: string;
}
