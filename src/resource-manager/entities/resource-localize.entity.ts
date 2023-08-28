import { IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, Unique } from 'typeorm';

// * 리소스 로컬라이징 정보

export enum ResourceTypeEnum {
  minicut = 'minicut',
  illust = 'illust',
  live_object = 'live_object',
  live_illust = 'live_illust',
}

@Entity()
@Unique(['resource_type', 'lang'])
export class ResourceLocalize extends CoreEntity {
  @Column({ type: 'enum', enum: ResourceTypeEnum })
  @IsEnum(ResourceTypeEnum)
  resource_type: string; // minicut, illust, live_object, live_illust 일단 4가지.

  @Column({ length: 10 })
  lang: string;

  @Column({ length: 60, default: '-' })
  public_name: string;

  @Column({ length: 500, default: '-' })
  summary: string;
}
