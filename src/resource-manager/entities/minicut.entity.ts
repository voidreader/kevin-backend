import { CommonImageResourceEntity } from 'src/common/entities/common-image-resource.entity';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity()
@Unique(['project_id', 'image_name'])
@Index(['project_id', 'is_public', 'speaker'])
export class Minicut extends CommonImageResourceEntity {
  @Column({ nullable: true, length: 30 })
  speaker: string;
}
