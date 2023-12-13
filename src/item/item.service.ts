import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/database/produce_entity/item.entity';
import { DataSource, Repository } from 'typeorm';
import { ItemListDto, ItemCreateDto } from './dto/item.dto';
import { DiscardResource } from 'src/resource-manager/entities/discard-resource.entity';
import { ItemExtension } from 'src/database/produce_entity/item-extension.entity';
import { winstonLogger } from '../util/winston.config';

@Injectable()
export class ItemService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Item)
    private readonly repItem: Repository<Item>,
    @InjectRepository(ItemExtension)
    private readonly repItemExtension: Repository<ItemExtension>,
    @InjectRepository(DiscardResource)
    private readonly repDiscardResource: Repository<DiscardResource>,
  ) {}

  // * 아이템 리스트
  async getItemList(project_id: number): Promise<ItemListDto> {
    const list = await this.repItem.find({
      where: { project_id },
      order: { origin_name: 'ASC' },
    });

    winstonLogger.debug(list, `getItemList(${project_id})`);

    return { isSuccess: true, list };
  }

  async createNewItem(
    project_id: number,
    dto: ItemCreateDto,
  ): Promise<ItemListDto> {
    const newItem = this.repItem.create(dto);
    newItem.project_id = project_id;

    if (!newItem.extension) {
      newItem.extension = this.repItemExtension.create();
    }

    try {
      await this.repItem.save(newItem);
      return this.getItemList(project_id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteItem(project_id: number, id: number) {
    try {
      await this.repItem.softDelete({ id });
      return this.getItemList(project_id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // * 아이콘 이미지 변경
  async changeItemIcon(file: Express.MulterS3.File, id: number) {
    if (!file) {
      throw new HttpException('Invalid file!', HttpStatus.BAD_REQUEST);
    }
    const { location, key, bucket } = file;

    const item = await this.repItem.findOneBy({ id });
    if (!item) {
      throw new HttpException('Invalid item id!', HttpStatus.BAD_REQUEST);
    }

    if (item.icon_url && item.icon_key) {
      this.saveDiscardImage(item.icon_url, item.icon_key);
    }

    item.icon_url = location;
    item.icon_key = key;
    item.icon_bucket = bucket;

    try {
      this.repItem.save(item);
      return {
        isSuccess: true,
        icon_url: location,
        icon_key: key,
        icon_bucket: bucket,
      };
    } catch (error) {
      throw new HttpException(
        'failed to save item icon!',
        HttpStatus.BAD_REQUEST,
      );
    }
  } // ? END changeItemIcon

  // * 아이템 리소스 이미지 변경
  async changeItemImage(file: Express.MulterS3.File, id: number) {
    if (!file) {
      throw new HttpException('Invalid file!', HttpStatus.BAD_REQUEST);
    }
    const { location, key, bucket } = file;
    const item = await this.repItem.findOneBy({ id });
    if (!item) {
      throw new HttpException('Invalid item id!', HttpStatus.BAD_REQUEST);
    }

    if (item.image_url && item.image_key) {
      this.saveDiscardImage(item.image_url, item.image_key);
    }

    item.image_url = location;
    item.image_key = key;
    item.image_bucket = bucket;

    try {
      this.repItem.save(item);
      return {
        isSuccess: true,
        image_url: location,
        image_key: key,
        image_bucket: bucket,
      };
    } catch (error) {
      throw new HttpException(
        'failed to save item resource image!',
        HttpStatus.BAD_REQUEST,
      );
    }
  } // ?  END changeItemImage

  // * 수정
  async editItemInfo(project_id: number, dto: ItemCreateDto) {
    console.log(dto);

    try {
      await this.repItem.save(dto);
      return this.getItemList(project_id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // * 이미지 Discard 처리 : S3에 업로드된 파일을 지울때 사용
  private saveDiscardImage(url: string, key: string) {
    const discardItem = this.repDiscardResource.create();
    discardItem.key = key;
    discardItem.url = url;

    this.repDiscardResource.save(discardItem);
  }
}
