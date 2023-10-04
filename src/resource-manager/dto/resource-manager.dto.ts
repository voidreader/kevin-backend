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

// export class UpdateBackgroundDto extends PartialType(Background) {}
// export class UpdateMinicutDto extends PartialType(Minicut) {}
