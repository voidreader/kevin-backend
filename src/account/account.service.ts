import { Inject, Injectable } from '@nestjs/common';
import { CreateAccountInputDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../database/produce_entity/account.entity';
import { DataSource, Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { ProjectAuth } from './entities/projectAuth.entity';
import { PRODUCE_DATASOURCE } from 'src/common/common.const';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accounts: Repository<Account>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    @InjectRepository(ProjectAuth)
    private readonly projectAuthRepo: Repository<ProjectAuth>,
    private readonly jwtService: JwtService,
    @Inject(PRODUCE_DATASOURCE) private readonly produceDataSource: DataSource,
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
    // console.log(account.projectAuths);

    // 인증 토큰
    const token = this.jwtService.sign(account.id);

    return {
      isSuccess: true,
      token,
      account,
    };
  } // ? 로그인 종료

  // * 계정 인증
  async verify(code: string) {
    const verification = await this.verifications.findOne({
      relations: {
        account: true,
      },
    });

    console.log(verification);
  } // ? 계정 인증 종료

  findAll() {
    return `This action returns all account`;
  }

  //* ID 찾기
  async findOne(id: number): Promise<LoginOutput> {
    const account = await this.accounts.findOne({ where: { id } });

    if (account) {
      return { account, isSuccess: true };
    } else {
      return {
        account: null,
        isSuccess: false,
        error: `Can't find the account`,
      };
    }
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
