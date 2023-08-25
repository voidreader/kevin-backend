import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // 단일 파일 업로드
  @Post('upload/:project_id/:type')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    return this.fileService.uploadFile(file);
  }

  // 멀티 파일 업로드
  @Post('multi-upload/:project_id/:type')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Array<Express.MulterS3.File>) {
    return this.fileService.uploadFiles(files);
  }
}
