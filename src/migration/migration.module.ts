import { Module } from '@nestjs/common';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUser } from 'src/gamedb/entities/GameUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameUser], 'game')],
  controllers: [MigrationController],
  providers: [MigrationService],
})
export class MigrationModule {}
