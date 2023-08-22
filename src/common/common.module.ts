import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandardInfo } from './entities/standard-info.entity';
import { TextLocalize } from './entities/text-localize.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandardInfo, TextLocalize])],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
