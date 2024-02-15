import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionFactory } from 'src/common/utils/multer.option';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/database/produce_entity/item.entity';
import { ItemLang } from 'src/database/produce_entity/item-lang.entity';
import { ItemExtension } from 'src/database/produce_entity/item-extension.entity';
import { DiscardResource } from 'src/database/produce_entity/discard-resource.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, ItemLang, ItemExtension, DiscardResource]),

    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
