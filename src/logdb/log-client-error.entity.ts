import { BigCoreEntity } from 'src/common/entities/big-core.entity';
import { Column, Entity, Index } from 'typeorm';

// * 픽키스, 클라이언트 에러 로그 테이블

@Entity()
@Index(['project_id', 'created_at'])
@Index(['userkey', 'created_at'])
export class LogClientError extends BigCoreEntity {
  @Column()
  userkey: number;
  @Column()
  project_id: number;
  @Column({ length: 2000, nullable: true })
  raw_data: string;
  @Column({ length: 240 })
  error_message: string; //
}
