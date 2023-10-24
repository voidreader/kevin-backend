import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ability } from 'src/database/produce_entity/ability.entity';
import { ProfileLine } from 'src/database/produce_entity/profile-line.entity';
import { Profile } from 'src/database/produce_entity/profile.entity';
import { Repository } from 'typeorm';
import { ProfileListOutputDto } from './dto/profile.dto';

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

  // * 등장인물 리스트
  async getProfileList(project_id: number): Promise<ProfileListOutputDto> {
    const list = await this.repProfile.find({
      where: { project_id },
      order: { speaker: 'ASC' },
    });

    return { isSuccess: true, list };
  }

  async createProfile() {}
}
