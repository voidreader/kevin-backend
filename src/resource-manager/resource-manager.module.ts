import { Module } from '@nestjs/common';
import { ResourceManagerService } from './resource-manager.service';
import { ResourceManagerController } from './resource-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Background } from './entities/background.entity';
import { DiscardResource } from './entities/discard-resource.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionFactory } from 'src/common/utils/multer.option';
import { Minicut } from './entities/minicut.entity';
import { ResourceLocalize } from './entities/resource-localize.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Background,
      DiscardResource,
      Minicut,
      ResourceLocalize,
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [ResourceManagerController],
  providers: [ResourceManagerService],
  exports: [ResourceManagerService],
})
export class ResourceManagerModule {}
