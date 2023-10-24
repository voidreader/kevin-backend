import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/database/produce_entity/profile.entity';
import { ProfileLang } from 'src/database/produce_entity/profile-lang.entity';
import { ProfileLine } from 'src/database/produce_entity/profile-line.entity';
import { ProfileLineLang } from 'src/database/produce_entity/profile-line-lang.entity';
import { Ability } from 'src/database/produce_entity/ability.entity';
import { AbilityLang } from 'src/database/ability-lang.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      ProfileLang,
      ProfileLine,
      ProfileLineLang,
      Ability,
      AbilityLang,
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
