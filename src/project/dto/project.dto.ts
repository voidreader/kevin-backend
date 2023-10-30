import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dto/output.dto';
import {
  Episode,
  EpisodeTypeEnum,
} from 'src/database/produce_entity/episode.entity';
import { ProjectDetail } from 'src/database/produce_entity/project-detail.entity';
import { Project } from 'src/database/produce_entity/project.entity';
import { Script } from 'src/database/produce_entity/script.entity';

// 프로젝스 생성 DTO
export class CreateProjectInputDto extends PickType(Project, [
  'project_type',
  'default_lang',
  'title',
]) {}

export class ProjectOutputDto extends CoreOutput {
  projects?: Project[];
}

export class SingleProjectOutputDto extends CoreOutput {
  project?: Project;
}

// 프로젝트 수정용
export class UpdateProjectInputDto extends PartialType(Project) {}

// 신규 에피소드 생성
export class CreateEpisodeDto {
  episode_type: EpisodeTypeEnum;
  title: string;
  dlc_id: number = -1;
}

export class UpdateEpisodeDto {
  file: Express.MulterS3.File;
  episode: Episode;
}

export class EpisodeListOutputDto extends CoreOutput {
  episodes?: Episode[];
}

export class UpdateEpisodeSortingInputDto {
  episodes: Episode[];
}

export class SaveScriptDto {
  script: Script[];
}
