import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionFactory } from 'src/common/utils/multer.option';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
