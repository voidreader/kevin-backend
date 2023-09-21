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
  @Get('sound/:project_id')
  async copySound(@Param('project_id') project_id: number) {
    return this.service.copySoundResource(project_id);
  }

  @Get('episode/:project_id')
  async copyEpisode(@Param('project_id') project_id: number) {
    return this.service.copyEpisodeScript(project_id);
  }

  @Get('product/:project_id')
  async copyProduct(@Param('project_id') project_id: number) {
    return this.service.copyProduct(project_id);
  }

  @Get('loading/:project_id')
  async copyEpisodeLoading(@Param('project_id') project_id: number) {
    return this.service.copyEpisodeLoading(project_id);
  }
  @Get('emoticon/:project_id')
  async copyEmoticon(@Param('project_id') project_id: number) {
    return this.service.copyEmoticon(project_id);
  }
  @Get('dress/:project_id')
  async copyDress(@Param('project_id') project_id: number) {
    return this.service.copyDress(project_id);
  }

  @Get('packages')
  async copyPackages() {
    return this.service.copyPackages();
  }
}
