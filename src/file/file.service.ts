import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  uploadFile(file: Express.MulterS3.File) {
    if (!file) {
      throw new BadRequestException('파일이 존재하지 않습니다');
    }

    console.log(file);
    return { filePath: file.location };
  }

  uploadFiles(files: Array<Express.MulterS3.File>) {
    console.log(files);
  }
}
