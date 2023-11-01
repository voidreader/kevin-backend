import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/database/produce_entity/item.entity';
import { DataSource, Repository } from 'typeorm';
import { ItemListDto, ItemCreateDto } from './dto/item.dto';

@Injectable()
export class ItemService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Item)
    private readonly repItem: Repository<Item>,
  ) {}

  // * 아이템 리스트
  async getItemList(project_id: number): Promise<ItemListDto> {
    const list = await this.repItem.find({
      where: { project_id },
      order: { origin_name: 'ASC' },
    });

    return { isSuccess: true, list };
  }

  async createNewItem(
    project_id: number,
    dto: ItemCreateDto,
  ): Promise<ItemListDto> {
    const newItem = this.repItem.create(dto);
    newItem.project_id = project_id;

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
}
