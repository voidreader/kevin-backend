import { PartialType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Ability } from 'src/database/produce_entity/ability.entity';
import { Profile } from 'src/database/produce_entity/profile.entity';

export class ProfileListOutputDto extends CoreOutput {
  list?: Profile[];
}

export class ProfileUpdateInputDto extends PartialType(Profile) {}

export class AbilityUpdateInputDto extends PartialType(Ability) {}
