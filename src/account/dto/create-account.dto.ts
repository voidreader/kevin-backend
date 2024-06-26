import { PickType } from '@nestjs/mapped-types';
import { Account } from '../../database/produce_entity/account.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

export class CreateAccountInputDto extends PickType(Account, [
  'email',
  'password',
  'organization',
]) {
  passwordConfirm: string;
}

export class VerifyInputDto extends PickType(Account, ['email']) {
  code: string;
}

export class CreateAccountOutputDto extends CoreOutput {
  account?: Account;
}
