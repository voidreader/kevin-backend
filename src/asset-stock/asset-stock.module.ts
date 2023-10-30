import { Module } from '@nestjs/common';
import { AssetStockController } from './asset-stock.controller';
import { AssetStockService } from './asset-stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryStaticImage } from 'src/resource-manager/entities/story-static-image.entity';
import { DiscardResource } from 'src/resource-manager/entities/discard-resource.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  multerAssetStockFactory,
  multerOptionFactory,
} from 'src/common/utils/multer.option';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoryStaticImage, DiscardResource]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerAssetStockFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [AssetStockController],
  providers: [AssetStockService],
})
export class AssetStockModule {}
