import { PickType } from '@nestjs/mapped-types';
import { Account } from '../entities/account.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

export class LoginInput extends PickType(Account, ['email', 'password']) {}

export class LoginOutput extends CoreOutput {
  account?: Account;
}
