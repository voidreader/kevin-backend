import { PickType } from '@nestjs/mapped-types';
import { Account } from '../../database/produce_entity/account.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

export class CreateAccountInputDto extends PickType(Account, [
  'email',
  'password',
]) {
  passwordConfirm: string;
}

export class CreateAccountOutputDto extends CoreOutput {
  account?: Account;
}
