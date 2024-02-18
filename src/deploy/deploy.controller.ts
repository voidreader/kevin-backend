import { Controller, Get, Param } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { DeploySimpleOutputDto } from './dto/deploy.dto';

@Controller('deploy')
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Get(`/project/:project_id/:data_type`)
  deployProjectData(
    @Param('project_id') project_id: number,
    @Param('data_type') data_type: string,
  ): Promise<DeploySimpleOutputDto> {
    return this.deployService.deployProjectData(project_id, data_type);
  }

  @Get(`/common/:data_type`)
  deployCommonData(
    @Param('data_type') data_type: string,
  ): Promise<DeploySimpleOutputDto> {
    return this.deployService.deployCommonData(data_type);
  }
}
