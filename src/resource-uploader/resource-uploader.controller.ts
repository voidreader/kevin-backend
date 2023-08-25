import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ResourceUploaderService } from './resource-uploader.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('resource-uploader')
export class ResourceUploaderController {
  constructor(private readonly service: ResourceUploaderService) {}

  @Post('/single-upload/:project_id/:type')
  @UseInterceptors(FileInterceptor('file'))
  uploadResource(
    @UploadedFile() file: Express.MulterS3.File,
    @Body('title') title: string,
    @Param('project_id') project_id: number,
    @Param('type') type: string,
  ) {
    console.log(title);
    return this.service.uploadResource(file, title, project_id, type);
  }

  @Post('/multi-upload/:project_id/:type')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultiResource(
    @UploadedFiles() files: Array<Express.MulterS3.File>,
    @Param('project_id') project_id: number,
    @Param('type') type: string,
  ) {
    return this.service.uploadMultiResource(files, project_id, type);
  }
}
