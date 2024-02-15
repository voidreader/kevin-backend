import { IsEmail, IsString, IsEnum, IsBoolean } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { ProjectAuth } from './projectAuth.entity';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

// * 제작시스템 사용자 계정 Entity

@Entity()
export class Account extends CoreEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string; // 이메일

  @Column({ default: '' })
  @IsString()
  userName: string; // 유저 이름

  @Column()
  @IsString()
  password: string; // 패스워드

  @Column({ nullable: true })
  @IsString()
  organization: string; // 조직

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  @IsEnum(UserRole)
  role: UserRole; // 유저 역할

  @Column({ default: false })
  @IsBoolean()
  verified: boolean; // 인증 여부

  @OneToMany((type) => ProjectAuth, (projectAuth) => projectAuth.account, {
    eager: true,
  })
  projectAuths: ProjectAuth[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }

  // 패스워드 체크
  async checkPassword(__password: string): Promise<boolean> {
    try {
      const result = await bcrypt.compare(__password, this.password);
      return result;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
