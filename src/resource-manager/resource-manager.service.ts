import { Get, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import {
  BackgroundImageUpdateDto,
  StaticImageDetailOutputDto,
  StaticImageOutputDto,
  ThumbnailOutputDto,
  UpdateStaticImageDto,
} from './dto/resource-manager.dto';
import { DiscardResource } from './entities/discard-resource.entity';
import { ImageLocalization } from './entities/image-localization.entity';
import { StoryStaticImage } from './entities/story-static-image.entity';

import * as multerS3 from 'multer-s3';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Project } from 'src/database/produce_entity/project.entity';
import { ConfigService } from '@nestjs/config';
import { PublicExtension } from './entities/public-extension.entity';
import {
  OLD_Q_COPY_LIST_BG,
  OLD_Q_COPY_LIST_ILLUST,
  OLD_Q_COPY_LIST_ILLUST_LANG,
  OLD_Q_COPY_LIST_ILLUST_THUMBNAIL,
  OLD_Q_COPY_LIST_MINICUT,
  OLD_Q_COPY_LIST_MINICUT_LANG,
  OLD_Q_COPY_LIST_MINICUT_THUMBNAIL,
} from 'src/common/origin-schema.query';
import {
  RESOURCE_BG,
  RESOURCE_ILLUST,
  RESOURCE_MINICUT,
} from 'src/common/common.const';
import { of } from 'rxjs';

@Injectable()
export class ResourceManagerService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(StoryStaticImage)
    private readonly repStaticImage: Repository<StoryStaticImage>,

    @InjectRepository(ImageLocalization)
    private readonly repImageLocalization: Repository<ImageLocalization>,
    @InjectRepository(PublicExtension)
    private readonly repPublicExtension: Repository<PublicExtension>,

    @InjectRepository(Project)
    private readonly repProject: Repository<Project>,
    @InjectRepository(DiscardResource)
    private readonly repDiscard: Repository<DiscardResource>,

    private readonly configService: ConfigService, //thumbnailS3: S3Client
  ) {}

  // * 배경을 제외한 스태틱 이미지 리소스 수정 2023.10.04
  async updateStaticImageInfo(
    id: number,
    updateStaticImageDto: UpdateStaticImageDto,
  ): Promise<StaticImageDetailOutputDto> {
    let image: StoryStaticImage =
      this.repStaticImage.create(updateStaticImageDto);

    image.is_updated = true;
    console.log(`update image : `, image);

    try {
      image = await this.repStaticImage.save(image);
    } catch (error) {
      return { isSuccess: false, error };
    }

    return { isSuccess: true, detail: image };
  } // ? END updateStaticImageInfo

  // * 배경 리소스 일반 정보 수정 2023.10.04
  async updateBackgroundImageInfo(
    id: number,
    updateStaticImageDto: UpdateStaticImageDto,
  ): Promise<StaticImageDetailOutputDto> {
    const { image_name, game_scale, is_updated } = updateStaticImageDto;

    try {
      await this.repStaticImage.update(id, {
        image_name,
        game_scale,
        is_updated,
      });
    } catch (error) {
      return { isSuccess: false, error };
    }

    const refresh = await this.repStaticImage.findOneBy({
      id,
    });

    return { isSuccess: true, detail: refresh };
  } // ? updateBackgroundImage

  // * 올드 데이터 카피, 컨버팅 (마이그레이션으로 이동 필요)
  async copyOriginStaticImageResource(project_id: number, type: string) {
    let result: StoryStaticImage[];
    const updateItems: StoryStaticImage[] = [];

    if (type == RESOURCE_BG)
      result = await this.dataSource.query(OLD_Q_COPY_LIST_BG, [project_id]);
    else if (type == RESOURCE_MINICUT)
      result = await this.dataSource.query(OLD_Q_COPY_LIST_MINICUT, [
        project_id,
      ]);
    else if (type == RESOURCE_ILLUST)
      result = await this.dataSource.query(OLD_Q_COPY_LIST_ILLUST, [
        project_id,
      ]);
    else {
      return { isSuccess: false, error: 'Wrong type' };
    }

    console.log(`result origin data count : `, result.length);

    for (const origin of result) {
      console.log(`in for : `, origin);

      // 공개된 미니컷에 대한 추가 처리
      if (
        origin.is_public &&
        (origin.image_type == RESOURCE_MINICUT ||
          origin.image_type == RESOURCE_ILLUST)
      ) {
        console.log(`is public !!!!!!!!!!!!!!!!!`);

        let Q_LANG = ``;
        let Q_THUMB = ``;

        if (origin.image_type == RESOURCE_MINICUT) {
          Q_LANG = OLD_Q_COPY_LIST_MINICUT_LANG;
          Q_THUMB = OLD_Q_COPY_LIST_MINICUT_THUMBNAIL;
        } else if (origin.image_type == RESOURCE_ILLUST) {
          Q_LANG = OLD_Q_COPY_LIST_ILLUST_LANG;
          Q_THUMB = OLD_Q_COPY_LIST_ILLUST_THUMBNAIL;
        }

        // localizations
        origin.localizations = await this.dataSource.query(Q_LANG, [
          origin.id,
          origin.image_type,
        ]);

        const extensions = await this.dataSource.query(Q_THUMB, [origin.id]);

        origin.extension = extensions[0];
      } else {
        origin.extension = this.getDefaultExtension();
        origin.localizations = [];
        origin.localizations.push(this.getDefaultLocalization(origin, 'KO'));
      }

      updateItems.push(origin);
    }

    // result.forEach((origin) => {
    //   // const item: StoryStaticImage = this.repStaticImage.create(origin);
    //   // const item = items[0];

    //   // console.log(`origin check : `, item);
    //   origin.extension = this.getDefaultExtension();
    //   origin.localizations = [];
    //   origin.localizations.push(this.getDefaultLocalization(origin, 'KO'));
    // });

    try {
      console.log('Start... Insert');

      await this.repStaticImage.save(updateItems);
    } catch (error) {
      if (
        error.driverError &&
        error.driverError.code &&
        error.driverError.sqlMessage
      ) {
        return { isSuccess: false, error: error.driverError.sqlMessage };
      } else return { isSuccess: false, error };
    }

    // console.log(result);
    return { isSuccess: true, total: result.length };
  } // ? END copy.

  // * default 데이터 만들기
  async createDefaultStaticResourceData(item: StoryStaticImage) {
    const project = await this.repProject.findOne({
      where: { project_id: item.project_id },
    });
    // const default_lang = (await project).default_lang;
    const default_lang = project.default_lang;

    // default localization
    const defaultLocalization = this.repImageLocalization.create({
      lang: default_lang,
      public_name: item.image_name,
      summary: '',
    });

    item.localizations.push(defaultLocalization);

    const defaultExtension = this.repPublicExtension.create({
      thumbnail_url: null,
      thumbnail_key: null,
      bucket: null,
    });

    item.extension = defaultExtension;

    await this.repStaticImage.save(item);

    // 썸네일은 나중에 해야지...
    // const thumbnailS3 = new S3Client({
    //   region: this.configService.get('AWS_REGION'),
    //   credentials: {
    //     accessKeyId: this.configService.get('AWS_KEY'),
    //     secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    //   },
    // });

    // const imageData = await thumbnailS3.send(
    //   new GetObjectCommand({
    //     Bucket: this.configService.get('AWS_BUCKET_NAME'),
    //     Key: item.image_key,
    //   }),
    // );

    // default extension
  }

  // * 이미지 Discard 처리 : S3에 업로드된 파일을 지울때 사용
  private saveDiscardImage(url: string, key: string) {
    const discardItem = this.repDiscard.create();
    discardItem.key = key;
    discardItem.url = url;

    this.repDiscard.save(discardItem);
  }

  // * Static Image 리소스 상세정보
  async getStaticResourceDetail(
    id: number,
  ): Promise<StaticImageDetailOutputDto> {
    const item = await this.repStaticImage.findOne({ where: { id } });

    if (!item) {
      return { isSuccess: false, error: `Can't find the resource` };
    }

    return { isSuccess: true, detail: item };
  }

  // * Static 이미지 리스트 가져오기 (배경, 일러스트 미니컷)
  async getStaticImageList(
    project_id: number,
    image_type: string,
  ): Promise<StaticImageOutputDto> {
    const list = await this.repStaticImage.find({
      where: { project_id, image_type },
    });

    return { isSuccess: true, list };
  } // ? END getStaticImageList

  // 단일 리소스 생성
  async createStaticImage(
    file: Express.MulterS3.File,
    image_name: string,
    project_id: number,
    image_type: string,
  ): Promise<StaticImageOutputDto> {
    const project = await this.repProject.findOne({
      where: { project_id },
    });

    const { location, key, bucket } = file;
    const item = this.repStaticImage.create({
      project_id,
      image_url: location,
      image_key: key,
      bucket,
      image_name,
      image_type,
    });

    item.localizations = [];
    item.localizations.push(
      this.getDefaultLocalization(item, project.default_lang),
    );

    item.extension = this.getDefaultExtension();

    try {
      await this.repStaticImage.save(item);
    } catch (error) {
      this.saveDiscardImage(location, key);
      return { isSuccess: false, error };
    }

    return this.getStaticImageList(project_id, image_type);
  } // ? END createStaicImage

  async createMultiStaticImage(
    files: Array<Express.MulterS3.File>,
    project_id: number,
    image_type: string,
  ): Promise<StaticImageOutputDto> {
    const list: StoryStaticImage[] = [];

    files.forEach((file) => {
      const item = this.repStaticImage.create({
        project_id,
        image_type,
        image_url: file.location,
        image_key: file.key,
        bucket: file.bucket,
        image_name: path.basename(
          file.originalname,
          path.extname(file.originalname),
        ),
      });

      list.push(item);
    });

    try {
      if (list && list.length > 0) await this.repStaticImage.save(list);
    } catch (error) {
      files.forEach((file) => {
        this.saveDiscardImage(file.location, file.key);
      });

      return { isSuccess: false, error };
    }

    return this.getStaticImageList(project_id, image_type);
  } // ? END createMultiStaticImage

  // * 스태틱 이미지 리소스 업데이트
  async updateStaticImage(
    file: Express.MulterS3.File,
    id: number,
  ): Promise<StaticImageOutputDto> {
    console.log(`updateStaticImage START`);

    let incomingDiscard: DiscardResource = null;

    if (!file) {
      return { isSuccess: false, error: 'Invalid File' };
    }

    // 파일 정보
    const { location, key, bucket } = file;

    // 원래 이미지 찾기.
    const target: StoryStaticImage = await this.repStaticImage.findOneBy({
      id,
    });

    if (!target) {
      return { isSuccess: false, error: 'Invalid Resource ID' };
    }

    // 업데이트 파라매터
    const updateParam = {
      image_url: location,
      image_key: key,
      bucket,
    };

    // update
    try {
      await this.repStaticImage.update(id, updateParam);
    } catch (error) {
      this.saveDiscardImage(location, key);
      return { isSuccess: false, error };
    }

    // 기존 이미지 discard 처리
    this.saveDiscardImage(target.image_url, target.image_key);

    return { isSuccess: true, ...updateParam };
  } // ? END updateStaticImage

  // * 스태틱 리소스 이미지 삭제
  async DeleteStaticImage(id: number): Promise<StaticImageOutputDto> {
    const item = await this.repStaticImage.findOne({ where: { id } });

    const { project_id, image_type } = item;

    if (!item) {
      return this.getStaticImageList(project_id, image_type);
    }

    this.saveDiscardImage(item.image_url, item.image_key);
    await this.repStaticImage.delete(id);

    return this.getStaticImageList(project_id, image_type);
  }

  //
  getDefaultExtension() {
    return this.repPublicExtension.create({
      thumbnail_url: null,
      thumbnail_key: null,
      bucket: null,
    });
  }

  // Default Image Localization 생성
  getDefaultLocalization(
    item: StoryStaticImage,
    default_lang: string,
  ): ImageLocalization {
    return this.repImageLocalization.create({
      lang: default_lang,
      public_name: item.image_name,
      summary: '',
    });
  }

  // Static Image Thumbnail 업데이트
  async updateStaticThumbnail(
    file: Express.MulterS3.File,
    id: number,
  ): Promise<ThumbnailOutputDto> {
    // 파일이 없는 경우.
    if (!file) {
      console.log(`updateStaticThumbnail failed : invalid file`);
      return { isSuccess: false, error: 'invalid file' };
    }

    const item = await this.repStaticImage.findOne({ where: { id } });
    const { location, key, bucket } = file;

    // 소속된 리소스가 없는 경우.
    if (!item) {
      console.log(`updateStaticThumbnail failed : invalid resource id`);
      return { isSuccess: false, error: 'invalid resource id' };
    }

    if (item.extension == null) {
      item.extension = this.repPublicExtension.create({
        thumbnail_url: location,
        thumbnail_key: key,
        bucket,
      });
    } else {
      // upload된 값 저장
      item.extension.thumbnail_url = location;
      item.extension.thumbnail_key = key;
      item.extension.bucket = bucket;
    }

    try {
      await this.repStaticImage.save(item);
    } catch (error) {
      console.log(error);
    }

    return {
      isSuccess: true,
      thumbnail_url: location,
      thumbnail_key: key,
      bucket,
    };
  }
}
