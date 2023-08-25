import { Injectable } from '@nestjs/common';
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
    if (type == 'bg')
      return this.managerService.createBackground(file, title, project_id);
  }

  uploadMultiResource(
    files: Array<Express.MulterS3.File>,
    project_id: number,
    type: string,
  ) {
    // console.log(files);

    if (type == 'bg')
      return this.managerService.createMultiBackground(files, project_id);
  }
}
