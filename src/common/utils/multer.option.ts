import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import * as path from 'path';
import { Request } from 'express';

interface resourceUploadOptions {
  project_id: number;
  type: string;
}

export const multerOptionFactory = (
  configService: ConfigService,
): MulterOptions => {
  const s3 = new S3Client({
    region: configService.get('AWS_REGION'),
    credentials: {
      accessKeyId: configService.get('AWS_KEY'),
      secretAccessKey: configService.get('AWS_SECRET_KEY'),
    },
  });

  return {
    storage: multerS3({
      s3,
      bucket: configService.get('AWS_BUCKET_NAME'),
      acl: 'public-read',
      key(_req: Express.Request, file, done) {
        const ext = path.extname(file.originalname); // 파일의 확장자 추출
        const basename = path.basename(file.originalname, ext); // 파일 이름
        // 파일 이름이 중복되는 것을 방지하기 위해 파일이름_날짜.확장자 형식으로 설정합니다.
        // console.log(`multer create : `, _req);
        const options: resourceUploadOptions = _req['params'];

        if (!options.type) options.type = 'com';

        console.log(options);

        done(
          null,
          `assets/${options.project_id}/${
            options.type
          }/${basename}_${Date.now()}${ext}`,
        );
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
  };
};
