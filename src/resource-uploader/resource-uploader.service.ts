import { Injectable } from '@nestjs/common';
import { RESOURCE_BG, RESOURCE_MINICUT } from 'src/common/common.const';
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

    // 타입에 따라서 각자 다른 서비스 메소드 호출.
    if (type == RESOURCE_BG)
      return this.managerService.createBackground(file, title, project_id);
    else if (type == RESOURCE_MINICUT)
      return this.managerService.createMinicut(file, title, project_id);
  }

  uploadMultiResource(
    files: Array<Express.MulterS3.File>,
    project_id: number,
    type: string,
  ) {
    // console.log(files);

    if (type == RESOURCE_BG)
      return this.managerService.createMultiBackground(files, project_id);
    else if (type == RESOURCE_MINICUT)
      return this.managerService.createMultiMinicut(files, project_id);
  }
}
