import { CommonImageResourceEntity } from 'src/common/entities/common-image-resource.entity';
import { CoreDeployEntity } from 'src/common/entities/core-deploy.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { ResourceLocalize } from './resource-localize.entity';

// * 배경 리소스 Entity

@Entity()
@Unique(['project_id', 'image_name'])
export class Background extends CommonImageResourceEntity {}
