import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(
    @Body() createAccountInputDto: CreateAccountInputDto,
  ): Promise<CreateAccountOutputDto> {
    return this.accountService.create(createAccountInputDto);
  }

  @Post('login')
  async login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.accountService.login(loginInput);
  }

  @Post('verify')
  async verify(@Param('code') code: string, @Param('email') email: string) {
    return this.accountService.verify(email, code);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
