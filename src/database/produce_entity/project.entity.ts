import { IsEnum } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectDetail } from './project-detail.entity';

export enum ProjectType {
  Otome = 'Otome',
  VisualNovel = 'VisualNovel',
}

export enum LangType {
  KO = 'KO',
  EN = 'EN',
  JA = 'JA',
  AR = 'AR',
}

// 프로젝트 마스터 Entity
@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  project_id: number; // 프로젝트 ID

  @Column({
    type: 'enum',
    enum: ProjectType,
    default: ProjectType.Otome,
  })
  @IsEnum(ProjectType)
  project_type: ProjectType; // 프로젝트 타입

  @Column({ default: LangType.KO, length: 10 })
  default_lang: string; // 대표 언어

  @Column({ default: 0 })
  sortkey: number; // 정렬 순서

  @Column({ default: 0 })
  bubble_set_id: number; // 말풍선 세트 ID

  @Column({ nullable: true, unique: true })
  produce_package_id: string; // KEVIN 패키지 ID
  @Column({ nullable: true, unique: true })
  bundle_id: string; // 스토어 bundle id

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany((type) => ProjectDetail, (projectDetail) => projectDetail.project)
  projectDetails: ProjectDetail[];
}