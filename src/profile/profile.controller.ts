import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(`/:project_id`)
  getProfileList(@Param('project_id') project_id: number) {
    return this.profileService.getProfileList(project_id);
  }
}
