import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  AbilityUpdateInputDto,
  ProfileListOutputDto,
  ProfileUpdateInputDto,
} from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post(`/:project_id/:profile_id/ability`)
  createAbility(
    @Param('project_id') project_id: number,
    @Param('profile_id') profile_id: number,
    @Body() dto: AbilityUpdateInputDto,
  ) {
    return this.profileService.createAbility(project_id, profile_id, dto);
  }

  @Patch(`/:project_id/:profile_id/ability/:ability_id`)
  updateAbility(
    @Param('project_id') project_id: number,
    @Param('profile_id') profile_id: number,
    @Param('ability_id') ability_id: number,
    @Body() dto: AbilityUpdateInputDto,
  ) {
    return this.profileService.updateAbility(project_id, profile_id, dto);
  }

  @Put(`/:project_id/:profile_id/ability/:ability_id`)
  @UseInterceptors(FileInterceptor('file'))
  updateAbilityIcon(
    @UploadedFile() file: Express.MulterS3.File,
    @Param('project_id') project_id: number,
    @Param('profile_id') profile_id: number,
    @Param('ability_id') ability_id: number,
  ) {
    return this.profileService.updateAbilityIcon(file, ability_id);
  }

  @Delete(`/:project_id/:profile_id/ability/:ability_id`)
  deleteAbility(
    @Param('project_id') project_id: number,
    @Param('profile_id') profile_id: number,
    @Param('ability_id') ability_id: number,
  ) {
    return this.profileService.deleteAbility(
      project_id,
      profile_id,
      ability_id,
    );
  }
}
