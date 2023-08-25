import { CoreOutput } from 'src/common/dto/output.dto';
import { Background } from '../entities/background.entity';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class BackgroundsOutputDto extends CoreOutput {
  backgrounds?: Background[] = [];
}

export class UpdateBackgroundDto extends PartialType(Background) {}
