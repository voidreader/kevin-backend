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
  Put,
} from '@nestjs/common';
import { ResourceManagerService } from './resource-manager.service';

import { FileInterceptor } from '@nestjs/platform-express';
import {
  RESOURCE_BG,
  RESOURCE_ILLUST,
  RESOURCE_MINICUT,
} from 'src/common/common.const';
import { UpdateStaticImageDto } from './dto/resource-manager.dto';

@Controller('resource-manager')
export class ResourceManagerController {
  constructor(
    private readonly resourceManagerService: ResourceManagerService,
  ) {}

  // 리소스 리스트 조회 (기본)
  @Get(':project_id/:image_type')
  getBackgroundList(
    @Param('project_id') project_id: number,
    @Param('image_type') image_type: string,
  ): Promise<any> {
    switch (image_type) {
      case RESOURCE_BG:
      case RESOURCE_MINICUT:
      case RESOURCE_ILLUST:
        return this.resourceManagerService.getStaticImageList(
          project_id,
          image_type,
        );
    }
  }

  // Static 리소스 업데이트
  @Patch('/static')
  @UseInterceptors(FileInterceptor('file'))
  updateStoryResource(
    @UploadedFile() file: Express.MulterS3.File,
    @Body() updateDto: UpdateStaticImageDto,
  ) {
    console.log(`updateStoryResource :`, updateDto);

    return this.resourceManagerService.updateStaticImage(file, updateDto);
  }

  @Delete('/static/:id')
  DeleteResource(@Param('id') id: number) {
    this.resourceManagerService.DeleteStaticImage(id);
  }

  // Thumbnail 업로드
  @Post(`/static-thumbnail/:project_id/:type/:id`)
  @UseInterceptors(FileInterceptor('file'))
  updateStaticThumbnail(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('id') id: number,
    @Param('project_id') project_id: number,
    @Param('type') type: string,
  ) {
    return this.resourceManagerService.updateStaticThumbnail(file, id);
  }
}
