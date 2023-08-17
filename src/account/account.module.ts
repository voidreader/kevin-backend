import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../database/produce_entity/account.entity';
import { Verification } from './entities/verification.entity';
import { ProjectAuth } from './entities/projectAuth.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Verification, ProjectAuth]),
    DatabaseModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
