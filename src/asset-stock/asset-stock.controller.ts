import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AssetStockService } from './asset-stock.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateStaticImageDto } from 'src/resource-manager/dto/resource-manager.dto';

@Controller('asset-stock')
export class AssetStockController {
  constructor(private readonly assetStockService: AssetStockService) {}

  @Get(`/:image_type`)
  getAssetStockImageList(@Param('image_type') image_type: string) {
    console.log(`getAssetStockImageList : ${image_type}`);

    return this.assetStockService.getAssetStockImageList(image_type);
  }

  @Post(`/:image_type`)
  @UseInterceptors(FilesInterceptor('files'))
  createMultiStockImage(
    @UploadedFiles() files: Array<Express.MulterS3.File>,
    @Param('image_type') image_type: string,
  ) {
    return this.assetStockService.createMultiStockImage(image_type, files);
  }

  @Put(`/:image_type/:id`)
  editStockImage(
    @Param('id') id: number,
    @Body('update') updateStaticImageDto: UpdateStaticImageDto,
  ) {
    return this.assetStockService.editStockImage(id, updateStaticImageDto);
  }

  @Patch(`/:image_type/:id`)
  @UseInterceptors(FileInterceptor('file'))
  changeStockImage(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('id') id: number,
  ) {
    return this.assetStockService.changeStockImage(file, id);
  }

  @Delete(`/:image_type/:id`)
  deleteStockImage(
    @Param('image_type') image_type: string,
    @Param('id') id: number,
  ) {
    return this.assetStockService.deleteStockImage(image_type, id);
  }
}
