import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ResourceManagerService } from './resource-manager.service';
import { Background } from './entities/background.entity';
import {
  BackgroundsOutputDto,
  UpdateBackgroundDto,
} from './dto/resource-manager.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  // 배경 리소스 업데이트
  @Post('/update/:project_id/bg')
  @UseInterceptors(FileInterceptor('file'))
  updateBackground(
    @UploadedFile() file: Express.MulterS3.File,
    @Body() updateDto: UpdateBackgroundDto,
    @Param('project_id') project_id: number,
  ) {
    return this.resourceManagerService.updateBackground(
      file,
      updateDto,
      project_id,
    );
  }

  @Delete('/update/:project_id/:type/:id')
  DeleteResource(
    @Param('project_id') project_id: number,
    @Param('type') type: string,
    @Param('id') id: number,
  ) {
    if (type == 'bg') {
      return this.resourceManagerService.DeleteBackground(project_id, id);
    } else {
      return `invalid type`;
    }
  }
    
}
