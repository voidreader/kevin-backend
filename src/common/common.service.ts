import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StandardInfo } from './entities/standard-info.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(StandardInfo)
    private readonly repStandard: Repository<StandardInfo>,
    private readonly dataSource: DataSource,
  ) {}

  async getStandard(standard_class: string): Promise<StandardInfo[]> {
    return this.dataSource
      .createQueryBuilder(StandardInfo, 'std')
      .select()
      .where(`standard_class = '${standard_class}'`)
      .orderBy('std.sortkey')
      .getMany();

    // return this.repStandard.find({ where: { standard_class } });
  }

  getLocalizedStandard(
    standard_class: string,
    lang: string = 'EN',
  ): Promise<any> {
    if (standard_class == 'prime_currency') {
      // 유료 재화 목록
      return this.dataSource.query(`
      SELECT si.code 
          , produce.fn_get_localize_text(si.text_id, '${lang}') code_name
      FROM produce.standard_info si
      WHERE si.standard_class = '${standard_class}';
      `);
    }
  }

  // * 말풍선 세트 dropdown
  getAvailableBubbleSet(lang: string = 'EN'): Promise<any> {
    // 구 버전 데이터베이스 그대로 사용. 나중에 이관
    return this.dataSource.query(`
     SELECT a.set_id code
          , a.set_name code_name
        FROM pier.com_bubble_master a
      WHERE a.bubble_type  = 'half'
      ORDER BY a.set_id;`);
  }
}
