import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/dto/output.dto';
import { ProjectDetail } from 'src/database/produce_entity/project-detail.entity';
import { Project } from 'src/database/produce_entity/project.entity';

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

// 프로젝트 수정 DTO
export class UpdateProjectInputDto extends PartialType(Project) {}
