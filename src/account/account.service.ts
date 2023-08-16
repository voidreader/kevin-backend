import { Injectable } from '@nestjs/common';
import { CreateAccountInputDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { ProjectAuth } from './entities/projectAuth.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accounts: Repository<Account>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    @InjectRepository(ProjectAuth)
    private readonly projectAuthRepo: Repository<ProjectAuth>,
  ) {}

  // 계정 생성
  async create(createAccountDto: CreateAccountInputDto) {
    console.log(createAccountDto);

    // 이메일 계정 존재 유무 확인
    const isExists = await this.accounts.findOne({
      where: { email: createAccountDto.email },
    });
    if (isExists) {
      return {
        isSuccess: false,
        error: 'The email is already created',
      };
    }

    try {
      const newAccount = await this.accounts.save(
        this.accounts.create(createAccountDto),
      );
      // 인증 정보 생성
      const verification = await this.verifications.save(
        this.verifications.create({
          account: newAccount,
        }),
      );

      // 정상 실행됨
      return { account: newAccount, isSuccess: true };
    } catch (error) {
      return {
        isSuccess: false,
        error,
      };
    }
  }

  // * 로그인
  async login(loginInput: LoginInput): Promise<LoginOutput> {
    const account = await this.accounts.findOne({
      where: { email: loginInput.email },
    });

    if (!account) {
      return {
        isSuccess: false,
        error: 'No user exists',
      };
    }

    const isPasswordCorrect = await account.checkPassword(loginInput.password);
    if (!isPasswordCorrect) {
      return {
        isSuccess: false,
        error: 'Wrong password',
      };
    }

    // const auths = await this.projectAuthRepo.find({ where: { account } });
    // console.log(auths);
    console.log(account.projectAuths);

    return {
      isSuccess: true,
      account,
    };
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
