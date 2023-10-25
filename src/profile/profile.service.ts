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

  // * 프로필 정리 (조회용도)
  arrangeProfileForSelect(profile: Profile) {
    // 프론트엔드에서는 각각 구역을 나눠보여주기 때문에 분리한다.
    profile.favorite_localizations = [];
    profile.dislike_localizations = [];
    profile.introduce_localizations = [];
    profile.etc_localizations = [];

    profile.localizations.forEach((lang) => {
      if (lang.text_type == 'favorite')
        profile.favorite_localizations.push(lang);
      else if (lang.text_type == 'dislike')
        profile.dislike_localizations.push(lang);
      else if (lang.text_type == 'introduce')
        profile.introduce_localizations.push(lang);
      else if (lang.text_type == 'etc') profile.etc_localizations.push(lang);
    });
  }

  // * 프로필 정리 (저장용도)
  arrangeProfileForSave(profile: Profile) {
    // 프론트엔드에서는 각각 구역을 나눠보여주기 때문에 분리한다.
    profile.favorite_localizations = [];
    profile.dislike_localizations = [];
    profile.introduce_localizations = [];
    profile.etc_localizations = [];

    // 순차적으로 localization array 에 추가하기
    if (profile.favorite_localizations) {
      profile.favorite_localizations.forEach((lang) => {
        if (!profile.localizations.includes(lang))
          profile.localizations.push(lang);
      });
    }
    if (profile.dislike_localizations) {
      profile.dislike_localizations.forEach((lang) => {
        if (!profile.localizations.includes(lang))
          profile.localizations.push(lang);
      });
    }
    if (profile.introduce_localizations) {
      profile.introduce_localizations.forEach((lang) => {
        if (!profile.localizations.includes(lang))
          profile.localizations.push(lang);
      });
    }
    if (profile.etc_localizations) {
      profile.etc_localizations.forEach((lang) => {
        if (!profile.localizations.includes(lang))
          profile.localizations.push(lang);
      });
    }
  }

  // * 등장인물 리스트
  async getProfileList(project_id: number): Promise<ProfileListOutputDto> {
    const list = await this.repProfile.find({
      where: { project_id },
      order: { speaker: 'ASC' },
    });

    list.forEach((profile) => {
      this.arrangeProfileForSelect(profile);
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
