import { Module } from '@nestjs/common';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUser } from 'src/gamedb/entities/game-user';
import { Profile } from 'src/database/produce_entity/profile.entity';
import { Ability } from 'src/database/produce_entity/ability.entity';
import { Item } from 'src/database/produce_entity/item.entity';
import { ItemExtension } from 'src/database/produce_entity/item-extension.entity';
import { ItemLang } from 'src/database/produce_entity/item-lang.entity';
import { Model } from 'src/database/produce_entity/model.entity';
import { ModelSlave } from 'src/database/produce_entity/model-slave.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameUser], 'game'),
    TypeOrmModule.forFeature([
      Profile,
      Ability,
      Item,
      ItemExtension,
      ItemLang,
      Model,
      ModelSlave,
    ]),
  ],
  controllers: [MigrationController],
  providers: [MigrationService],
})
export class MigrationModule {}
