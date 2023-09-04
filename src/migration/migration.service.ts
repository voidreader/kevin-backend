import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameUser } from 'src/gamedb/entities/GameUser.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MigrationService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(GameUser, 'game')
    private readonly repUser: Repository<GameUser>,
  ) {}

  // table_account => user
  async copyOldUser() {
    let result: GameUser[];

    result = await this.dataSource.query(`
    SELECT ta.userkey  
    , ta.pincode 
    , ta.uid 
    , ifnull(ta.alter_name, '리아나')  nickname 
    , ta.energy prime_currency
    , ta.deviceid device_id 
    , ta.gamebaseid thirdparty_id
    , ta.os 
    , ta.current_lang 
    , ta.current_culture 
    , ta.country 
    , ta.package  bundle_id
    , 142 project_id
    , ifnull(ta.client_ver, '1.0.1') client_ver
 FROM pier.table_account ta
 WHERE ta.userkey < 2550;
    `);

    try {
      await this.repUser.save(result);
    } catch (error) {
      return { isSuccess: false, error };
    }

    return { isSuccess: true, total: result.length };
  }
}
