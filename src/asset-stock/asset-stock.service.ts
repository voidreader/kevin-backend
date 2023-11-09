import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoryStaticImage } from 'src/resource-manager/entities/story-static-image.entity';
import { DataSource, Repository } from 'typeorm';
import { AssetStockListDto } from './dto/asset-stock.dto';
import { DiscardResource } from 'src/resource-manager/entities/discard-resource.entity';
import * as path from 'path';
import { UpdateStaticImageDto } from 'src/resource-manager/dto/resource-manager.dto';

@Injectable()
export class AssetStockService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(StoryStaticImage)
    private readonly repStaticImage: Repository<StoryStaticImage>,
    @InjectRepository(DiscardResource)
    private readonly repDiscard: Repository<DiscardResource>,
  ) {}

  // 스톡 이미지 리스트 조회
  async getAssetStockImageList(image_type: string): Promise<AssetStockListDto> {
    const list = await this.repStaticImage.find({
      where: { image_type, project_id: 0 },
    });
    return { isSuccess: true, list };
  }

  // 스톡 이미지 추가 (관리자)
  async createMultiStockImage(
    image_type: string,
    files: Array<Express.MulterS3.File>,
  ): Promise<AssetStockListDto> {
    const list: StoryStaticImage[] = [];

    if (!files) {
      new HttpException('invalid files', HttpStatus.BAD_REQUEST);
    }

    files.forEach((file) => {
      // console.log(file);
      file.originalname = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );

      const item = this.repStaticImage.create({
        project_id: 0, // 0 으로 고정
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

      throw new HttpException(
        `failed to upload Files : ${error}`,
        HttpStatus.BAD_REQUEST,
      );
      //   return { isSuccess: false, error };
    }

    return this.getAssetStockImageList(image_type);
  } // ? END createMultiStockImage

  // 스톡 이미지 이름 수정
  async editStockImage(id: number, updateStaticImageDto: UpdateStaticImageDto) {
    const { image_name, game_scale, is_updated } = updateStaticImageDto;

    try {
      await this.repStaticImage.update(id, {
        image_name,
        game_scale,
        is_updated: true,
      });
    } catch (error) {
      return { isSuccess: false, error };
    }

    const refresh = await this.repStaticImage.findOneBy({
      id,
    });

    return { isSuccess: true, detail: refresh };
  }

  // 스톡 이미지(만) 변경
  async changeStockImage(file: Express.MulterS3.File, id: number) {
    let incomingDiscard: DiscardResource = null;

    if (!file) {
      throw new HttpException('Invalid File', HttpStatus.BAD_REQUEST);
    }

    const { location, key, bucket } = file;

    // 원래 이미지 찾기.
    const target: StoryStaticImage = await this.repStaticImage.findOneBy({
      id,
    });

    if (!target) {
      throw new HttpException('Invalid Resource ID', HttpStatus.BAD_REQUEST);
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
      throw new HttpException(
        `Failed to change image : ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 기존 이미지 discard 처리
    this.saveDiscardImage(target.image_url, target.image_key);

    return { isSuccess: true, ...updateParam };
  } // ? END change image

  // 스톡 이미지 삭제
  async deleteStockImage(
    image_type: string,
    id: number,
  ): Promise<AssetStockListDto> {
    await this.repStaticImage.delete({ id });

    return this.getAssetStockImageList(image_type);
  }

  // * 이미지 Discard 처리 : S3에 업로드된 파일을 지울때 사용
  private saveDiscardImage(url: string, key: string) {
    const discardItem = this.repDiscard.create();
    discardItem.key = key;
    discardItem.url = url;

    this.repDiscard.save(discardItem);
  }
}
