import { Controller, Get, Param } from '@nestjs/common';
import { DeployService } from './deploy.service';

@Controller('deploy')
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Get(`/:project_id/:data_type`)
  deployEach(
    @Param('project_id') project_id: number,
    @Param('data_type') data_type: string,
  ) {}
}
