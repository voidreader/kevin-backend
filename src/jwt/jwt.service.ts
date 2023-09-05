import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtModuleOptions } from './jwt.interfaces';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTION } from 'src/common/common.const';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTION) private readonly options: JwtModuleOptions,
  ) {
    console.log(`JwtService : `, options);
  }

  sign(id: number): string {
    return jwt.sign({ id }, this.options.privateKey);
  }

  verify(token: string): string | object {
    try {
      return jwt.verify(token, this.options.privateKey);
    } catch {
      return null;
    }
  }
}
