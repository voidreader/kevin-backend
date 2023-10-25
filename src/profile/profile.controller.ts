import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileListOutputDto, ProfileUpdateInputDto } from './dto/profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(`/:project_id`)
  getProfileList(@Param('project_id') project_id: number) {
    return this.profileService.getProfileList(project_id);
  }

  @Post(`/:project_id`)
  createProfile(
    @Param('project_id') project_id: number,
    @Body() dto: ProfileUpdateInputDto,
  ): Promise<ProfileListOutputDto> {
    return this.profileService.createProfile(project_id, dto);
  }

  @Delete(`/:project_id/:id`)
  deleteProfile(
    @Param('project_id') project_id: number,
    @Param('id') id: number,
  ): Promise<ProfileListOutputDto> {
    return this.profileService.deleteProfile(project_id, id);
  }

  @Patch(`/:project_id/:id`)
  updateProfile(
    @Param('project_id') project_id: number,
    @Body() dto: ProfileUpdateInputDto,
  ) {
    return this.profileService.updateProfile(project_id, dto);
  }
}
