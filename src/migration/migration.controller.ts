import { Controller, Get } from '@nestjs/common';
import { MigrationService } from './migration.service';

@Controller('migration')
export class MigrationController {
  constructor(private readonly service: MigrationService) {}

  // 안전을 위해 뒤에 xxx 붙여놓음.

  @Get('accountxxx')
  async CopyOldUser() {
    return this.service.copyOldUser();
  }
}
