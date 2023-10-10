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
import {
  BackgroundImageUpdateDto,
  ModelCreateDto,
  StaticImageDetailOutputDto,
  UpdateStaticImageDto,
} from './dto/resource-manager.dto';
import { Model } from 'src/database/produce_entity/model.entity';

@Controller('resource-manager')
export class ResourceManagerController {
  constructor(
    private readonly resourceManagerService: ResourceManagerService,
  ) {}

  @Get(`/model/:project_id`)
  getModelList(@Param('project_id') project_id: number): Promise<Model[]> {
    return this.resourceManagerService.getModelList(project_id);
  }

  @Post(`/model/:project_id`)
  createModel(
    @Param('project_id') project_id: number,
    @Body() dto: ModelCreateDto,
  ): Promise<Model[]> {
    console.log(`createModel with `, dto);

    return this.resourceManagerService.createModel(project_id, dto);
  }

  @Post(`/model/:project_id/:model_id`)
  @UseInterceptors(FileInterceptor('file'))
  uploadModelZip(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('project_id') project_id: number,
    @Param('model_id') model_id: number,
  ) {
    return this.resourceManagerService.uploadModelZip(
      project_id,
      model_id,
      file,
    );
  } // ? END uploadModelZip

  // * 모델의 모션이름  업데이트
  @Patch(`/model/:project_id/:model_id`)
  updateModelMotion(
    @Param('model_id') model_id: number,
    @Body('model_slave_id') model_slave_id: number,
    @Body('motion_name') motion_name: string,
  ): Promise<Model> {
    return this.resourceManagerService.updateModelMotion(
      model_id,
      model_slave_id,
      motion_name,
    );
  }

  /////////////////////////////////////////////

  // 리소스 리스트 조회 (기본)
  @Get('/static/:project_id/:image_type')
  getStaticResourceList(
    @Param('project_id') project_id: number,
    @Param('image_type') image_type: string,
  ): Promise<any> {
    console.log(`getStaticResourceList`);

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

  @Get('/static/:id')
  getStaticResourceDetail(@Param('id') id: number) {
    console.log(`getStaticResourceDetail : `, id);

    return this.resourceManagerService.getStaticResourceDetail(id);
  }

  // static 이미지 리소스 정보 수정
  @Put('/static/:project_id/:type/:id')
  updateStaticImageInfo(
    @Param('project_id') project_id: number,
    @Param('type') type: string,
    @Param('id') id: number,
    @Body('update') updateStaticImageDto: UpdateStaticImageDto,
  ): Promise<StaticImageDetailOutputDto> {
    console.log(updateStaticImageDto);

    if (type == 'bg') {
      return this.resourceManagerService.updateBackgroundImageInfo(
        id,
        updateStaticImageDto,
      );
    } else {
      return this.resourceManagerService.updateStaticImageInfo(
        id,
        updateStaticImageDto,
      );
    }
  } // ? END updateStaticImageResource

  // Static 이미지 리소스 이미지 수정
  @Patch('/static/:project_id/:type/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateStaticImage(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('id') id: number,
  ) {
    return this.resourceManagerService.updateStaticImage(file, id);
  } // ? END updateStaticImage

  @Delete('/static/:id')
  DeleteResource(@Param('id') id: number) {
    console.log('DeleteResource');

    this.resourceManagerService.DeleteStaticImage(id);
  }

  // Thumbnail 업로드
  @Post(`/static-thumbnail/:project_id/:id`)
  @UseInterceptors(FileInterceptor('file'))
  updateStaticThumbnail(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('id') id: number,
    @Param('project_id') project_id: number,
  ) {
    console.log(`updateStaticThumbnail : ${id} / ${project_id}`);

    return this.resourceManagerService.updateStaticThumbnail(file, id);
  }

  // * pier의 이전 데이터 컨버팅 및 복사.
  @Get(`/static-copy/:project_id/:type`)
  copyOriginStaticImageResource(
    @Param('project_id') project_id: number,
    @Param('type') type: string,
  ) {
    return this.resourceManagerService.copyOriginStaticImageResource(
      project_id,
      type,
    );
  }
}
