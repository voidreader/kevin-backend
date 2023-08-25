import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResourceManagerService } from './resource-manager.service';
import { Background } from './entities/background.entity';
import { BackgroundsOutputDto } from './dto/resource-manager.dto';

@Controller('resource-manager')
export class ResourceManagerController {
  constructor(
    private readonly resourceManagerService: ResourceManagerService,
  ) {}

  // 배경 리스트 조회
  @Get(':project_id/bg')
  getBackgroundList(
    @Param('project_id') project_id: number,
  ): Promise<BackgroundsOutputDto> {
    console.log(`getBackgroundList : `, project_id);

    return this.resourceManagerService.getBackgroundList(project_id);
  }
}
