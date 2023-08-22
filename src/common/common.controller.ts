import { Controller, Get, Param } from '@nestjs/common';
import { CommonService } from './common.service';
import { StandardInfo } from './entities/standard-info.entity';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get(`/:standard_class`)
  getStandard(
    @Param('standard_class') standard_class: string,
  ): Promise<StandardInfo[]> {
    return this.commonService.getStandard(standard_class);
  }
}
