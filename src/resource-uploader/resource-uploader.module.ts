import { Module } from '@nestjs/common';
import { ResourceUploaderService } from './resource-uploader.service';
import { ResourceUploaderController } from './resource-uploader.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionFactory } from 'src/common/utils/multer.option';
import { ResourceManagerService } from 'src/resource-manager/resource-manager.service';
import { ResourceManagerModule } from 'src/resource-manager/resource-manager.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Background } from 'src/resource-manager/entities/background.entity';
import { DiscardResource } from 'src/resource-manager/entities/discard-resource.entity';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Background, DiscardResource]),
  ],

  providers: [ResourceUploaderService, ResourceManagerService],
  controllers: [ResourceUploaderController],
})
export class ResourceUploaderModule {}
