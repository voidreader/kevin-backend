import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { StandardInfo } from './entities/standard-info.entity';

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
}
