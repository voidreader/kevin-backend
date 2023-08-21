import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 생성된 시간
  @CreateDateColumn({ select: false })
  createdAt: Date;

  // 업데이트된 시간
  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
