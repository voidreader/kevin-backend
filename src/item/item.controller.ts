import { ItemService } from './item.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ItemCreateDto } from './dto/item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get(`/:project_id`)
  getItemList(@Param('project_id') project_id: number) {
    return this.itemService.getItemList(project_id);
  }

  @Post(`/:project_id`)
  createNewItem(
    @Param('project_id') project_id: number,
    @Body() dto: ItemCreateDto,
  ) {
    return this.itemService.createNewItem(project_id, dto);
  }

  @Delete(`/:project_id/:id`)
  deleteItem(@Param('project_id') project_id: number, @Param('id') id: number) {
    return this.itemService.deleteItem(project_id, id);
  }
}
