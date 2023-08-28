import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { Background } from './entities/background.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import {
  BackgroundsOutputDto,
  MinicutOutputDto,
  UpdateBackgroundDto,
  UpdateMinicutDto,
} from './dto/resource-manager.dto';
import { DiscardResource } from './entities/discard-resource.entity';
import { Minicut } from './entities/minicut.entity';
import { ResourceLocalize } from './entities/resource-localize.entity';

@Injectable()
export class ResourceManagerService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Background)
    private readonly repBackground: Repository<Background>,
    @InjectRepository(Minicut)
    private readonly repMinicut: Repository<Minicut>,
    @InjectRepository(ResourceLocalize)
    private readonly repResourceLocalize: Repository<ResourceLocalize>,
    @InjectRepository(DiscardResource)
    private readonly repDiscard: Repository<DiscardResource>,
  ) {}

  // * 이미지 Discard 처리
  private saveDiscardImage(url: string, key: string) {
    const discardItem = this.repDiscard.create();
    discardItem.key = key;
    discardItem.url = url;

    this.repDiscard.save(discardItem);
  }

  // * 미니컷

  // * 프로젝트 미니컷 리스트
  async getMinicutList(project_id: number): Promise<MinicutOutputDto> {
    const minicuts = await this.repMinicut.find({
      where: { project_id },
    });

    return { isSuccess: true, minicuts };
  }

  async createMinicut(
    file: Express.MulterS3.File,
    title: string,
    project_id: number,
  ): Promise<MinicutOutputDto> {
    const { location, key, bucket } = file;
    const item = this.repMinicut.create({
      project_id,
      image_url: location,
      image_key: key,
      bucket,
      image_name: title,
    });

    try {
      await this.repMinicut.save(item);
    } catch (error) {
      this.saveDiscardImage(location, key);
      return { isSuccess: false, error };
    }

    return this.getMinicutList(project_id);
  } // ? end create minicut

  async createMultiMinicut(
    files: Array<Express.MulterS3.File>,
    project_id: number,
  ): Promise<MinicutOutputDto> {
    const minicuts: Minicut[] = [];
    files.forEach((file) => {
      const item = this.repMinicut.create();
      item.project_id = project_id;
      item.image_url = file.location;
      item.image_key = file.key;
      item.bucket = item.bucket;
      item.image_name = path.basename(
        file.originalname,
        path.extname(file.originalname),
      );

      minicuts.push(item);
    });

    try {
      await this.repMinicut.save(minicuts);
    } catch (error) {
      files.forEach((file) => {
        this.saveDiscardImage(file.location, file.key);
      });

      return { isSuccess: false, error };
    }

    return this.getMinicutList(project_id);
  } // ? END of createMultiMinicut

  // 미니컷 리소스 삭제
  async DeleteMinicut(
    project_id: number,
    id: number,
  ): Promise<MinicutOutputDto> {
    const item = await this.repMinicut.findOne({ where: { id } });
    if (!item) {
      return this.getBackgroundList(project_id);
    }

    this.saveDiscardImage(item.image_url, item.image_key);
    await this.repBackground.delete(id);

    return this.getMinicutList(project_id);
  }

  async updateMinicut(
    file: Express.MulterS3.File,
    updateDto: UpdateMinicutDto,
    project_id: number,
  ): Promise<MinicutOutputDto> {
    let currentDiscard: DiscardResource = null;
    let incomingDiscard: DiscardResource = null;
    const item = this.repMinicut.create(updateDto);
    item.isUpdated = true; // 업데이트 되었음을 처리

    // 파일이 있는 경우에 대한 처리
    if (file) {
      // discard에 추가 (기존 이미지는 삭제 )
      currentDiscard = this.repDiscard.create();
      currentDiscard.key = item.image_key;
      currentDiscard.url = item.image_url;

      // 방금 업로드된 신규 파일
      incomingDiscard = this.repDiscard.create();
      incomingDiscard.key = file.key;
      incomingDiscard.url = file.location;

      item.image_key = file.key;
      item.image_url = file.location;
      item.bucket = file.bucket;
    }

    // 업데이트
    try {
      await this.repMinicut.update(item.id, item);
    } catch (error) {
      // 업데이트 실패시에는 신규파일을 삭제
      if (incomingDiscard) {
        this.repDiscard.save(incomingDiscard);
      }

      return { isSuccess: false, error };
    }

    // 리턴
    return this.getMinicutList(updateDto.project_id);
  } // ? END update Minicut

  //////////////////////////////  미니컷 끝.

  // * 프로젝트 배경 리스트 조회
  async getBackgroundList(project_id: number): Promise<BackgroundsOutputDto> {
    const backgrounds = await this.repBackground.find({
      where: { project_id },
    });

    return { isSuccess: true, backgrounds };
  }

  // * 프로젝트 배경 정보 업데이트
  async updateBackground(
    file: Express.MulterS3.File,
    updateDto: UpdateBackgroundDto,
    project_id: number,
  ): Promise<BackgroundsOutputDto> {
    let currentDiscard: DiscardResource = null;
    let incomingDiscard: DiscardResource = null;
    const updatedBG = this.repBackground.create(updateDto);
    updatedBG.isUpdated = true; // 업데이트 되었음을 처리

    if (file) {
      // 파일이 변경되었으면 값도 변경

      // discard에 추가 (기존 이미지는 삭제 )
      currentDiscard = this.repDiscard.create();
      currentDiscard.key = updatedBG.image_key;
      currentDiscard.url = updatedBG.image_url;

      // 방금 업로드된 신규 파일
      incomingDiscard = this.repDiscard.create();
      incomingDiscard.key = file.key;
      incomingDiscard.url = file.location;

      updatedBG.image_key = file.key;
      updatedBG.image_url = file.location;
      updatedBG.bucket = file.bucket;
    }

    // 업데이트
    try {
      await this.repBackground.update(updatedBG.id, updatedBG);
    } catch (error) {
      // 업데이트 실패시에는 신규파일을 삭제
      if (incomingDiscard) {
        this.repDiscard.save(incomingDiscard);
      }

      return { isSuccess: false, error };
    }

    // 성공 시에는 기존 파일을 삭제 대상으로 입력한다.
    if (currentDiscard) {
      this.repDiscard.save(currentDiscard);
    }

    // 리턴
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

  // * 배경 리소스 삭제
  async DeleteBackground(
    project_id: number,
    id: number,
  ): Promise<BackgroundsOutputDto> {
    const bg = await this.repBackground.findOne({ where: { id } });
    if (!bg) {
      return this.getBackgroundList(project_id);
    }

    this.saveDiscardImage(bg.image_url, bg.image_key);
    await this.repBackground.delete(id);

    return this.getBackgroundList(project_id);
  }
}
