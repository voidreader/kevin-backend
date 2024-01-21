import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ability } from 'src/database/produce_entity/ability.entity';
import { ProfileLine } from 'src/database/produce_entity/profile-line.entity';
import { Profile } from 'src/database/produce_entity/profile.entity';
import { Repository } from 'typeorm';
import {
  AbilityUpdateInputDto,
  ProfileListOutputDto,
  ProfileUpdateInputDto,
} from './dto/profile.dto';

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
    profile.section1_localizations = [];
    profile.section2_localizations = [];
    profile.section3_localizations = [];
    profile.section4_localizations = [];

    profile.localizations.forEach((lang) => {
      if (lang.text_type == 'section1')
        profile.section1_localizations.push(lang);
      else if (lang.text_type == 'section2')
        profile.section2_localizations.push(lang);
      else if (lang.text_type == 'section3')
        profile.section3_localizations.push(lang);
      else if (lang.text_type == 'section4')
        profile.section4_localizations.push(lang);
    });

    profile.abilities.forEach((ability) => {
      ability.profile_id = profile.id;
    });
  }

  // * 프로필 정리 (저장용도)
  arrangeProfileForSave(profile: ProfileUpdateInputDto) {
    profile.localizations = [];

    // 순차적으로 localization array 에 추가하기
    if (profile.section1_localizations) {
      profile.section1_localizations.forEach((lang) => {
        if (!profile.localizations.includes(lang))
          profile.localizations.push(lang);
      });
    }
    if (profile.section2_localizations) {
      profile.section2_localizations.forEach((lang) => {
        if (!profile.localizations.includes(lang))
          profile.localizations.push(lang);
      });
    }
    if (profile.section3_localizations) {
      profile.section3_localizations.forEach((lang) => {
        if (!profile.localizations.includes(lang))
          profile.localizations.push(lang);
      });
    }
    if (profile.section4_localizations) {
      profile.section4_localizations.forEach((lang) => {
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

  // * 프로필 업데이트 (프로필 라인과 프로필 정보)
  async updateProfile(project_id: number, dto: ProfileUpdateInputDto) {
    try {
      this.arrangeProfileForSave(dto);

      console.log(`updateProfile : `, dto);

      const profile = await this.repProfile.save(dto);
      this.arrangeProfileForSelect(profile);

      return { isSuccess: true, update: profile };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'failed to update a profile!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createAbility(
    project_id: number,
    profile_id: number,
    dto: AbilityUpdateInputDto,
  ) {
    try {
      const newAbility = this.repAbility.create(dto);
      let profile = await this.repProfile.findOneBy({ id: profile_id });
      profile.abilities.push(newAbility);

      profile = await this.repProfile.save(profile);
      this.arrangeProfileForSelect(profile);

      const list = await this.repProfile.find({
        where: { project_id },
        order: { speaker: 'ASC' },
      });

      list.forEach((profile) => {
        this.arrangeProfileForSelect(profile);
      });

      return { isSuccess: true, list, update: profile };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'failed to create an ability!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateAbility(
    project_id: number,
    profile_id: number,
    ability_id: number,
    dto: AbilityUpdateInputDto,
  ) {
    try {
      console.log(`updateAbility start`);

      const newAbility = this.repAbility.create(dto);
      let targetProfile = await this.repProfile.findOneBy({ id: profile_id });

      console.log(newAbility);
      newAbility.profile = targetProfile;

      // 능력 저장
      await this.repAbility.save(newAbility);

      const list = await this.repProfile.find({
        where: { project_id },
        order: { speaker: 'ASC' },
      });

      list.forEach((profile) => {
        this.arrangeProfileForSelect(profile);

        if (profile.id == profile_id) targetProfile = profile;
      });

      let targetAbility: Ability;

      targetProfile.abilities.forEach((ability) => {
        if (ability.ability_id == ability_id) targetAbility = ability;
      });

      return { isSuccess: true, list, update: targetAbility };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'failed to update an ability!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteAbility(
    project_id: number,
    profile_id: number,
    ability_id: number,
  ) {
    try {
      await this.repAbility.delete({ ability_id });

      const profile = await this.repProfile.findOneBy({ id: profile_id });
      this.arrangeProfileForSelect(profile);
      const list = await this.repProfile.find({
        where: { project_id },
        order: { speaker: 'ASC' },
      });

      list.forEach((profile) => {
        this.arrangeProfileForSelect(profile);
      });

      return { isSuccess: true, list, update: profile };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'failed to delete an ability!',
        HttpStatus.BAD_REQUEST,
      );
    }
  } // ? END deleteAbility

  async updateAbilityIcon(file: Express.MulterS3.File, ability_id: number) {
    console.log(`updateAbilityIcon called : `, file);

    if (!file) {
      throw new HttpException('Invalid file!', HttpStatus.BAD_REQUEST);
    }

    const ability = await this.repAbility.findOneBy({ ability_id });
    const { location, key, bucket } = file;

    if (!ability) {
      throw new HttpException('Invalid ability ID!', HttpStatus.BAD_REQUEST);
    }

    ability.icon_url = location;
    ability.icon_key = key;
    ability.bucket = bucket;

    try {
      await this.repAbility.save(ability);
      return {
        isSuccess: true,
        icon_url: location,
        icon_key: key,
        bucket,
      };
    } catch (error) {
      throw new HttpException(
        'failed to save ability icon!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
