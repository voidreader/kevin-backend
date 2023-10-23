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
import { Dress } from 'src/database/produce_entity/dress.entity';
import { Emoticon } from 'src/database/produce_entity/emoticon.entity';
import { EmoticonSlave } from 'src/database/produce_entity/emoticon-slave.entity';
import { SoundResource } from 'src/database/produce_entity/sound-resource.entity';
import { Nametag } from 'src/database/produce_entity/nametag.entity';

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

// 의상 DTO
export class DressUpdateInputDto extends PartialType(Dress) {}
export class DressUpdateOutputDto extends CoreOutput {
  update?: Dress;
}
export class DressListDto extends CoreOutput {
  list?: Dress[];
}

// * 이모티콘 DTO
export class EmoticonListDto extends CoreOutput {
  list?: Emoticon[];
}

export class EmoticonMasterCreateDto extends PartialType(Emoticon) {}
export class EmoticonUpdateOutputDto extends CoreOutput {
  update?: Emoticon;
}

export class EmoticonSlaveUpdateDto extends PartialType(EmoticonSlave) {}

export class SoundListDto extends CoreOutput {
  list?: SoundResource[];
}

export class NametagCreateDto extends PartialType(Nametag) {}

// export class UpdateBackgroundDto extends PartialType(Background) {}
// export class UpdateMinicutDto extends PartialType(Minicut) {}
