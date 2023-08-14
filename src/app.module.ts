import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [NoticeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
