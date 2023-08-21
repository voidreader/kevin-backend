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
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateProjectInputDto,
  ProjectOutputDto,
  SingleProjectOutputDto,
  UpdateProjectInputDto,
} from './dto/project.dto';

import { Account } from 'src/database/produce_entity/account.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

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

  @Get('/:id')
  async findOne(@Param('id') id: string) {
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
    @Body() inputDto: UpdateProjectInputDto,
  ): Promise<SingleProjectOutputDto> {
    return await this.projectService.update(project_id, inputDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStoryDto: UpdateStoryDto) {
  //   return this.projectService.update(+id, updateStoryDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
