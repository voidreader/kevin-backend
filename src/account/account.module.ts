import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Verification } from './entities/verification.entity';
import { ProjectAuth } from './entities/projectAuth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Verification, ProjectAuth])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
