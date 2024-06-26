import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { StandardInfo } from '../database/produce_entity/standard-info.entity';
import { get } from 'http';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  // 기본 코드 정보
  @Get(`/:standard_class`)
  getStandard(
    @Param('standard_class') standard_class: string,
  ): Promise<StandardInfo[]> {
    return this.commonService.getStandard(standard_class);
  }

  // 기본 코드 정보(언어값에 따라 번역)
  @Get('/localize/:standard_class')
  async getLocalizedStandard(
    @Param('standard_class') standard_class: string,
    @Query('lang') lang: string = 'EN',
  ) {
    const result = await this.commonService.getLocalizedStandard(
      standard_class,
      lang,
    );
    console.log(`getLocalizedStandard ${standard_class}/${lang}`, result);

    return result;

    // return this.commonService.getLocalizedStandard(standard_class, lang);
  }

  // 말풍선세트 dropdown
  @Get(`/etc/bubble`)
  getBubbleSetDropdown(@Query('lang') lang: string = 'EN'): Promise<any> {
    return this.commonService.getAvailableBubbleSet(lang);
  }

  @Get(`/project/:project_id/:type/:dlc_id`)
  getProjectDropdown(
    @Param('project_id') project_id: number,
    @Param('type') data_type: string,
    @Param('dlc_id') dlc_id: number = -1,
  ) {
    if (data_type == 'model') {
      return this.commonService.getProjectModelDowndown(project_id);
    } else if (data_type == 'episode') {
      return this.commonService.getProjectEpisodeDropdown(project_id, dlc_id);
    } else if (data_type == 'character') {
      return this.commonService.getProjectCharacterDropdown(project_id);
    } else if (data_type == 'minicut') {
      return this.commonService.getProjectMinicutList(project_id);
    } else if (data_type == 'bg') {
      return this.commonService.getProjectBackgroundDropdown(project_id);
    } else if (data_type == 'coupon') {
      return [];
    } else if (data_type == 'ability') {
      return this.commonService.getProjectAbilityListCode(project_id);
    }
  }

  @Get(`/profile/:project_id/:type/:arg`)
  getProfileDropdown(
    @Param('project_id') project_id: number,
    @Param('type') data_type: string,
    @Param('arg') arg: string,
  ) {
    if (data_type == 'motion') {
      return this.commonService.getProjectCharacterMotionDropdown(
        project_id,
        arg,
      );
    } else if (data_type == 'ability') {
      return this.commonService.getProjectAbilityListCode(project_id);
    } else {
      return [];
    }
  }

  @Get(`/script/template`)
  getScriptTemplateList(@Query('lang') lang: string) {
    return this.commonService.getScriptTemplateList(lang);
  }

  @Get(`/script/motion/:project_id`)
  getScriptMotionList(@Param('project_id') project_id: number) {
    return this.commonService.getScriptMotionList(project_id);
  }

  @Get(`/script/speaker/:project_id`)
  getScriptSpeakerList(@Param('project_id') project_id: number) {
    return this.commonService.getScriptSpeakerList(project_id);
  }

  @Get(`/script/emoticon/:project_id`)
  getScripEmoticonList(@Param('project_id') project_id: number) {
    return this.commonService.getScripEmoticonList(project_id);
  }

  @Get(`/script/resources/:project_id`)
  getScriptResources(@Param('project_id') project_id: number) {
    return this.commonService.getScriptResourceInfo(project_id);
  }

  @Get(`/kevin/standards`)
  getKevinStandards(@Query('lang') lang: string) {
    return this.commonService.getKevinStandards(lang);
  }
}
