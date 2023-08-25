import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Background } from './entities/background.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import {
  BackgroundsOutputDto,
  UpdateBackgroundDto,
} from './dto/resource-manager.dto';
import { DiscardResource } from './entities/discard-resource.entity';

@Injectable()
export class ResourceManagerService {
  constructor(
    @InjectRepository(Background)
    private readonly repBackground: Repository<Background>,
    @InjectRepository(DiscardResource)
    private readonly repDiscard: Repository<DiscardResource>,
  ) {}

  // 프로젝트 배경 리스트 조회
  async getBackgroundList(project_id: number): Promise<BackgroundsOutputDto> {
    const backgrounds = await this.repBackground.find({
      where: { project_id },
    });

    return { isSuccess: true, backgrounds };
  }

  // * 프로젝트 배경 정보 업데이트
  updateBackground(
    updateDto: UpdateBackgroundDto,
  ): Promise<BackgroundsOutputDto> {
    const updatedBG = this.repBackground.create(updateDto);
    updatedBG.isUpdated = true; // 업데이트 되었음을 처리

    this.repBackground.update(updatedBG.id, updatedBG);

    return this.getBackgroundList(updateDto.project_id);
  }

  // 배경 생성
  async createBackground(
    file: Express.MulterS3.File,
    title: string,
    project_id: number,
  ): Promise<BackgroundsOutputDto> {
    const { location, key, bucket } = file;

    const newBackground = this.repBackground.create();
    newBackground.project_id = project_id;
    newBackground.image_url = location;
    newBackground.image_key = key;
    newBackground.bucket = bucket;
    newBackground.image_name = title;

    try {
      await this.repBackground.save(newBackground);
    } catch (error) {
      const discardItem = this.repDiscard.create();
      discardItem.key = newBackground.image_key;
      discardItem.url = newBackground.image_url;
      this.repDiscard.save(discardItem);
      return { isSuccess: false, error };
    }

    return this.getBackgroundList(project_id);
  } // ? END createBackground

  // 멀티 배경 생성
  async createMultiBackground(
    files: Array<Express.MulterS3.File>,
    project_id: number,
  ): Promise<BackgroundsOutputDto> {
    const backgrounds: Background[] = [];

    files.forEach((item) => {
      const newBG = this.repBackground.create();
      newBG.project_id = project_id;
      newBG.image_url = item.location;
      newBG.image_key = item.key;
      newBG.bucket = item.bucket;
      newBG.image_name = path.basename(
        item.originalname,
        path.extname(item.originalname),
      );

      backgrounds.push(newBG);
    });

    try {
      await this.repBackground.save(backgrounds);
    } catch (error) {
      const discards: DiscardResource[] = [];

      // 실패시 discard 에 입력
      files.forEach((item) => {
        const discardItem = this.repDiscard.create();
        discardItem.key = item.key;
        discardItem.url = item.location;

        discards.push(discardItem);
      });

      this.repDiscard.save(discards);

      return { isSuccess: false, error };
    }

    return this.getBackgroundList(project_id);
  } // ? END createMultiBackground
}
