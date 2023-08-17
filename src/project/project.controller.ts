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
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Account } from 'src/database/produce_entity/account.entity';
import { AuthGuard } from 'src/auth/auth.guard';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Post()
  requestStoryList(@Req() request: Request) {
    console.log(`#### requestStoryList`);
    // console.log(request['account']);

    this.projectService.requestStoryList(request['account']);

    return { isSuccess: true };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoryDto: UpdateStoryDto) {
    return this.projectService.update(+id, updateStoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
