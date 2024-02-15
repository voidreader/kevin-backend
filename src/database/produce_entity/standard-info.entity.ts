import { IntersectionType } from '@nestjs/mapped-types';
import { CoreEntity } from '../../common/entities/core.entity';
import { DeployEntity } from '../../common/entities/deploy.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['standard_class', 'code'])
export class StandardInfo extends DeployEntity {
  @PrimaryGeneratedColumn({})
  standard_id: number;

  @Column({ length: 20, select: false })
  standard_class: string;

  @Column({ length: 30 })
  code: string;

  @Column({ length: 30 })
  code_name: string;

  @Column({ length: 150, nullable: true, select: false })
  comment: string;

  @Column({ nullable: true, select: false })
  text_id: number;

  @Column({ nullable: true, length: 30, select: false })
  extra: string;

  @Column({ default: 0, select: false })
  sortkey: number;
}
