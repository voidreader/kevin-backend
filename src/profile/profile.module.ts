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
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionFactory } from 'src/common/utils/multer.option';

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
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
