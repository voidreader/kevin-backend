import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountInputDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountInputDto) {}
