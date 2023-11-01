import { PartialType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Item } from 'src/database/produce_entity/item.entity';

export class ItemListDto extends CoreOutput {
  list?: Item[];
}

export class ItemCreateDto extends PartialType(Item) {}
