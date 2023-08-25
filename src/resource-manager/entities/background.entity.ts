import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import { Column, Entity, Unique } from 'typeorm';

// * 배경 리소스 Entity

@Entity()
@Unique(['project_id', 'image_name'])
export class Background extends CoreDeployEntity {
  @Column()
  project_id: number;

  @Column({ length: 30 })
  image_name: string;
  @Column({ length: 160 })
  image_url: string;
  @Column({ length: 120 })
  image_key: string;
  @Column({ length: 30 })
  bucket: string;

  @Column({ default: 1 })
  game_scale: number;
  @Column({ default: 0 })
  sortkey: number;
}
