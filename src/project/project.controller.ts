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
  CreateEpisodeDto,
  CreateProjectInputDto,
  EpisodeListOutputDto,
  ProjectOutputDto,
  SingleProjectOutputDto,
  UpdateEpisodeDto,
  UpdateEpisodeSortingInputDto,
  UpdateProjectInputDto,
} from './dto/project.dto';

import { Account } from 'src/database/produce_entity/account.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectDetail } from 'src/database/produce_entity/project-detail.entity';
import { Episode } from 'src/database/produce_entity/episode.entity';

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

  @Patch(`/icon-upload/:project_id/:lang`)
  @UseInterceptors(FileInterceptor('file'))
  // * 프로젝트 언어별 아이콘 업로드
  async uploadProjectIcon(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('project_id') project_id: number,
    @Param('lang') lang: string,
  ) {
    return this.projectService.uploadProjectIcon(file, project_id, lang);
  } //? end uploadProjectIcon

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }

  @Get(`/:project_id/episode`)
  // * 프로젝트 에피소드 리스트 조회
  async getEpisodeList(
    @Param('project_id') project_id: number,
  ): Promise<EpisodeListOutputDto> {
    return this.projectService.getEpisodeList(project_id);
  }

  // * 단일 에피소드 정보 업데이트
  @Put(`/:project_id/episode`)
  updateSingleEpisode(
    @Param('project_id') project_id: number,
    @Body() episode: Episode,
  ) {
    return this.projectService.updateSingleEpisode(episode);
  }

  // * 단일 에피소드 정보 배너 업로드
  @Patch(`/:project_id/episode/:episode_id/banner`)
  @UseInterceptors(FileInterceptor('file'))
  uploadEpisodeBanner(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('project_id') project_id: number,
    @Param('episode_id') episode_id: number,
  ) {
    return this.projectService.uploadEpisodeBanner(file, episode_id);
    // return this.projectService.updateSingleEpisode(file, episode);
  }

  // * 신규 에피소드 생성
  @Post(`/:project_id/episode`)
  createNewEpisode(
    @Param('project_id') project_id,
    @Body() inputDto: CreateEpisodeDto,
  ): Promise<EpisodeListOutputDto> {
    return this.projectService.createNewEpisode(project_id, inputDto);
  }

  @Delete(`/:project_id/episode/:episode_id`)
  deleteEpisode(
    @Param('episode_id') episode_id: number,
    @Param('project_id') project_id: number,
  ): Promise<EpisodeListOutputDto> {
    return this.projectService.deleteEpisoe(project_id, episode_id);
  }

  @Patch(`/:project_id/episode/sort`)
  // * 에피소드 리스트의 재정렬
  updateEpisodeSorting(
    @Body() inputDto: UpdateEpisodeSortingInputDto,
  ): Promise<EpisodeListOutputDto> {
    return this.updateEpisodeSorting(inputDto);
  }
}
