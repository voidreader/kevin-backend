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
import { LiveResource } from 'src/resource-manager/entities/live-resource.entity';
import { Nametag } from 'src/database/produce_entity/nametag.entity';
import { SoundResource } from 'src/database/produce_entity/sound-resource.entity';
import { Episode } from 'src/database/produce_entity/episode.entity';
import { Selection } from 'src/database/produce_entity/selection.entity';
import { Script } from 'src/database/produce_entity/script.entity';
import { Package } from 'src/database/produce_entity/package.entity';
import { PackageClient } from 'src/database/produce_entity/package-client.entity';

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
      LiveResource,
      Nametag,
      SoundResource,
      Episode,
      Selection,
      Script,
      Package,
      PackageClient,
    ]),
  ],
  controllers: [MigrationController],
  providers: [MigrationService],
})
export class MigrationModule {}
