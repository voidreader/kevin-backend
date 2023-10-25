import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ability } from 'src/database/produce_entity/ability.entity';
import { ProfileLine } from 'src/database/produce_entity/profile-line.entity';
import { Profile } from 'src/database/produce_entity/profile.entity';
import { Repository } from 'typeorm';
import { ProfileListOutputDto, ProfileUpdateInputDto } from './dto/profile.dto';

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

  // * 프로필 생성
  async createProfile(
    project_id: number,
    dto: ProfileUpdateInputDto,
  ): Promise<ProfileListOutputDto> {
    const newProfile = this.repProfile.create(dto);
    newProfile.project_id = project_id;

    console.log(newProfile);

    try {
      await this.repProfile.save(newProfile);
      return this.getProfileList(project_id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'failed to create new profile!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // * 프로필 삭제
  async deleteProfile(project_id: number, id: number) {
    try {
      await this.repProfile.delete({ id });
      return this.getProfileList(project_id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'failed to delete a profile!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // * 프로필 업데이트
  async updateProfile(project_id: number, dto: ProfileUpdateInputDto) {
    try {
      const profile = await this.repProfile.save(dto);
      return { isSuccess: true, update: profile };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'failed to update a profile!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
