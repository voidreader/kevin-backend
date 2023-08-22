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
}
