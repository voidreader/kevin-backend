import { Injectable } from '@nestjs/common';
import { CreateAccountInputDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accounts: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountInputDto) {
    console.log(createAccountDto);

    const newAccount = this.accounts.create(createAccountDto);

    try {
      await this.accounts.save(newAccount);
    } catch (error) {
      return {
        isSuccess: false,
        error,
      };
    }

    return { account: newAccount, isSuccess: true };
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
