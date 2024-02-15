import { CoreOutput } from 'src/common/dto/output.dto';
import { StoryStaticImage } from 'src/database/produce_entity/story-static-image.entity';

export class AssetStockListDto extends CoreOutput {
  list?: StoryStaticImage[];
}
