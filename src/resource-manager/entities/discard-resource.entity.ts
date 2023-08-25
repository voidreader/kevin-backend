import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

// 삭제 대상의 S3 리소스 Entity
@Entity()
export class DiscardResource extends CoreEntity {
  @Column({ length: 160 })
  url: string;

  @Column({ length: 120 })
  key: string;
}
