import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { StandardInfo } from './entities/standard-info.entity';
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
  getLocalizedStandard(
    @Param('standard_class') standard_class: string,
    @Query('lang') lang: string = 'EN',
  ) {
    console.log('getLocalizedStandard ', standard_class, lang);

    return this.commonService.getLocalizedStandard(standard_class, lang);
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
  ): Promise<any> {
    if (data_type == 'model') {
      return this.commonService.getProjectModelDowndown(project_id);
    } else if (data_type == 'episode') {
      return this.commonService.getProjectEpisodeDropdown(project_id, dlc_id);
    }
  }
}
