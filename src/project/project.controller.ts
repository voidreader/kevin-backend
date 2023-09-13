import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateProjectInputDto,
  EpisodeListOutputDto,
  ProjectOutputDto,
  SingleProjectOutputDto,
  UpdateProjectInputDto,
} from './dto/project.dto';

import { Account } from 'src/database/produce_entity/account.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectDetail } from 'src/database/produce_entity/project-detail.entity';

@Controller('story')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // @Post()
  // create(@Body() createStoryDto: CreateStoryDto) {
  //   return this.storyService.create(createStoryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.storyService.findAll();
  // }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<SingleProjectOutputDto> {
    return await this.projectService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  // * 스토리 목록 조회
  @Get()
  async getStoryList(@Req() request: Request): Promise<ProjectOutputDto> {
    console.log(`#### requestStoryList`);
    // console.log(request['account']);

    return await this.projectService.getStoryList(request['account']);
  }

  async getAlternativeStoryList(@Req() request: Request) {
    return await this.projectService.getAlternativeStoryList(
      request['account'],
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  // * 신규 스토리 생성
  async createStory(
    @Req() request,
    @Body() createProjectInputDto: CreateProjectInputDto,
  ) {
    return await this.projectService.create(
      request['account'],
      createProjectInputDto,
    );
  }

  @Put('/:project_id')
  async update(
    @Param('project_id') project_id: number,
    @Body('update') inputDto: UpdateProjectInputDto,
  ): Promise<SingleProjectOutputDto> {
    return await this.projectService.update(project_id, inputDto);
  }

  @Patch(`/icon-upload/:project_id`)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProjectIcon(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('project_id') project_id: number,
    @Body('detail') detail: ProjectDetail,
  ) {
    return this.projectService.uploadProjectIcon(file, detail);
  } //? end uploadProjectIcon

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }

  @Get(`/:project_id/episode`)
  async getEpisodeList(
    @Param('project_id') project_id: number,
  ): Promise<EpisodeListOutputDto> {
    return this.projectService.getEpisodeList(project_id);
  }
}
