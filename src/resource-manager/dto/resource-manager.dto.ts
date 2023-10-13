import { CoreOutput } from 'src/common/dto/output.dto';

import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/mapped-types';
import { StoryStaticImage } from '../entities/story-static-image.entity';
import { PublicExtension } from '../entities/public-extension.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Model } from 'src/database/produce_entity/model.entity';
import { LiveResource } from '../entities/live-resource.entity';

export interface unzipFile {
  Key: string;
  Location: string;
  Bucket: string;
}

export class StaticImageOutputDto extends CoreOutput {
  list?: StoryStaticImage[] = [];
}

export class StaticImageDetailOutputDto extends CoreOutput {
  detail?: StoryStaticImage;
}

export class UpdateStaticImageDto extends PartialType(StoryStaticImage) {}

export class ThumbnailOutputDto extends IntersectionType(
  CoreOutput,
  PartialType(
    PickType(PublicExtension, ['thumbnail_url', 'thumbnail_key', 'bucket']),
  ),
) {}

// * 배경 리소스 업데이트 DTO
export class BackgroundImageUpdateDto extends PartialType(CoreEntity) {
  image_name: string;

  game_scale: number;
  is_updated: boolean = true;
}

// * 모델 생성 DTO
export class ModelCreateDto {
  model_name: string;
}

export class ModelListDto extends CoreOutput {
  list?: Model[];
}

export class ModelUpdateDto extends PartialType(Model) {}

export class ModelUpdateOutputDto extends CoreOutput {
  update?: Model;
}

// 라이브 리소스 업데이트 DTO
export class LiveResourceUpdateDto extends PartialType(LiveResource) {}

// export class UpdateBackgroundDto extends PartialType(Background) {}
// export class UpdateMinicutDto extends PartialType(Minicut) {}
