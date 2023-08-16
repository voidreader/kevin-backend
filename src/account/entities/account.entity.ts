import { IsEmail, IsString, IsEnum, IsBoolean } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

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
}
