import { CoreOutput } from 'src/common/dto/output.dto';
import { Background } from '../entities/background.entity';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Minicut } from '../entities/minicut.entity';

export class BackgroundsOutputDto extends CoreOutput {
  backgrounds?: Background[] = [];
}
export class MinicutOutputDto extends CoreOutput {
  minicuts?: Minicut[] = [];
}

export class UpdateBackgroundDto extends PartialType(Background) {}
export class UpdateMinicutDto extends PartialType(Minicut) {}
