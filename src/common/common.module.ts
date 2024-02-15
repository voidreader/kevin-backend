import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandardInfo } from '../database/produce_entity/standard-info.entity';
import { TextLocalize } from '../database/produce_entity/text-localize.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandardInfo, TextLocalize])],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
