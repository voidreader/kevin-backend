import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { EmoticonSlave } from './emoticon-slave.entity';

// * 이모티콘 리소스 마스터

@Entity()
@Unique(['project_id', 'speaker'])
export class Emoticon extends CoreDeployEntity {
  @Column()
  project_id: number; // 연결 프로젝트 ID

  @Column({ length: 20 })
  speaker: string;

  @OneToMany((t) => EmoticonSlave, (es) => es.master, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  slaves: EmoticonSlave[];
}
