import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ability } from 'src/database/produce_entity/ability.entity';
import { ProfileLine } from 'src/database/produce_entity/profile-line.entity';
import { Profile } from 'src/database/produce_entity/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repProfile: Repository<Profile>,
    @InjectRepository(ProfileLine)
    private readonly repProfileLine: Repository<ProfileLine>,
    @InjectRepository(Ability)
    private readonly repAbility: Repository<Ability>,
  ) {}
}
