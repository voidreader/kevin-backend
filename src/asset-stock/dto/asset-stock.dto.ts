import { CoreOutput } from 'src/common/dto/output.dto';
import { StoryStaticImage } from 'src/resource-manager/entities/story-static-image.entity';

export class AssetStockListDto extends CoreOutput {
  list?: StoryStaticImage[];
}
