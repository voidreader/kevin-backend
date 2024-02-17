import { Controller, Get, Param } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { DeploySimpleOutputDto } from './dto/deploy.dto';

@Controller('deploy')
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Get(`/:project_id/:data_type`)
  deployEach(
    @Param('project_id') project_id: number,
    @Param('data_type') data_type: string,
  ): Promise<DeploySimpleOutputDto> {
    return this.deployService.deployOperateData(project_id, data_type);

    // switch (data_type) {
    //   case 'coupon':
    //     return this.deployService.deployAllCoupon(project_id);
    //   case 'notice':
    //     return this.deployService.deployAllNotice(project_id);
    //   default:
    //     return;
    // }
  }
}
