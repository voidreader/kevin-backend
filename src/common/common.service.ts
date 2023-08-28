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
}
