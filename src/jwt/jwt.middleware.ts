import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly accountService: AccountService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    // console.log(`###### JWT Middleware`);

    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];

      console.log(`token : `, token);
      const decoded = this.jwtService.verify(token.toString());
      console.log(`decoded : `, decoded);
      if (
        decoded != null &&
        typeof decoded === 'object' &&
        decoded.hasOwnProperty('id')
      ) {
        try {
          const { account, isSuccess } = await this.accountService.findOne(
            decoded['id'],
          );

          if (isSuccess) {
            req['account'] = account;
            console.log(`jwt middleware :: `, account);
          }

          // console.log(user);
        } catch (e) {
          console.log(`jwt decode exception : `, e);
        }
      }
    }

    next();
  }
}
