import { Injectable } from '@nestjs/common';
import {
  RESOURCE_BG,
  RESOURCE_ILLUST,
  RESOURCE_MINICUT,
} from 'src/common/common.const';
import { ResourceManagerService } from 'src/resource-manager/resource-manager.service';

@Injectable()
export class ResourceUploaderService {
  constructor(private readonly managerService: ResourceManagerService) {}

  uploadResource(
    file: Express.MulterS3.File,
    title: string,
    project_id: number,
    type: string,
  ) {
    // console.log(file);

    switch (type) {
      case RESOURCE_BG:
      case RESOURCE_MINICUT:
      case RESOURCE_ILLUST:
        return this.managerService.createStaticImage(
          file,
          title,
          project_id,
          type,
        );
    }
  }

  uploadMultiResource(
    files: Array<Express.MulterS3.File>,
    project_id: number,
    type: string,
  ) {
    // console.log(files);
    switch (type) {
      case RESOURCE_BG:
      case RESOURCE_MINICUT:
      case RESOURCE_ILLUST:
        return this.managerService.createMultiStaticImage(
          files,
          project_id,
          type,
        );
    }
  }
}
