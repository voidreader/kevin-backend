import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import { DeployEntity } from 'src/common/entities/deploy.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

// * 캐릭터 네임태그 Entity

@Entity()
export class Nametag extends DeployEntity {
  @PrimaryColumn()
  project_id: number;

  @PrimaryColumn({ length: 20 })
  speaker: string;

  @Column({ length: 10, default: 'FFFFFFFF' })
  main_color: string;
  @Column({ length: 10, default: 'FFFFFFFF' })
  sub_color: string;

  @Column({ length: 20, default: '-' })
  KO: string;
  @Column({ length: 20, default: '-' })
  EN: string;
  @Column({ length: 20, default: '-' })
  JA: string;
  @Column({ length: 20, default: '-' })
  AR: string;
  @Column({ length: 20, default: '-' })
  ID: string;
  @Column({ length: 20, default: '-' })
  ES: string;
  @Column({ length: 20, default: '-' })
  MS: string;
  @Column({ length: 20, default: '-' })
  RU: string;
  @Column({ length: 20, default: '-' })
  ZH: string;
  @Column({ length: 20, default: '-' })
  SC: string;
}
