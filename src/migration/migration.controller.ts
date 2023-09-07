import { Controller, Get, Param } from '@nestjs/common';
import { MigrationService } from './migration.service';

@Controller('migration')
export class MigrationController {
  constructor(private readonly service: MigrationService) {}

  // 안전을 위해 뒤에 xxx 붙여놓음.

  @Get('accountxxx')
  async CopyOldUser() {
    return this.service.copyOldUser();
  }

  @Get('live-illust/:project_id')
  async copyLiveIllust(@Param('project_id') project_id: number) {
    return this.service.copyLiveIllust(project_id);
  }

  @Get('model/:project_id')
  async copyModels(@Param('project_id') project_id: number) {
    return this.service.copyModels(project_id);
  }
  @Get('profile/:project_id')
  async copyProfile(@Param('project_id') project_id: number) {
    return this.service.copyProfile(project_id);
  }

  @Get('item/:project_id')
  async copyItem(@Param('project_id') project_id: number) {
    return this.service.copyItem(project_id);
  }
}
