import { IsEnum } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { LangType, Project } from './project.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

@Unique(['project', 'lang'])
@Entity()
export class ProjectDetail extends CoreEntity {
  @Column({ length: 10 })
  lang: string;

  @Column({ nullable: true })
  title: string;
  @Column({ nullable: true })
  summary: string;
  @Column({ nullable: true, length: 80 })
  writer: string;
  @Column({ nullable: true })
  icon_url: string; // 대표 아이콘 URL, KEY
  @Column({ nullable: true })
  icon_key: string;
  @Column({ nullable: true })
  original: string; // 원작
  @Column({ nullable: true })
  translator: string; // 번역자

  @ManyToOne((type) => Project, (project) => project.projectDetails, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
