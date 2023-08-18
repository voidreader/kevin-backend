import { Inject, Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { PRODUCE_DATASOURCE } from 'src/common/common.const';
import { DataSource } from 'typeorm';
import { Account } from 'src/database/produce_entity/account.entity';
import { Project } from 'src/database/produce_entity/project.entity';
import { ProjectAuth } from 'src/account/entities/projectAuth.entity';

@Injectable()
export class ProjectService {
  constructor(private readonly dataSource: DataSource) {}

  // * 권한에 따른 작품 리스트 조회
  async requestStoryList(account: Account) {
    // const rawData = await dataSource.query(`SELECT * FROM USERS`)

    console.log(`requestStoryList : `, account);
    console.log(`mainDataSource : `, this.dataSource.options.entities);
    // console.log(`subDataSource : `, this.subDataSource);

    const projects = await this.dataSource
      .createQueryBuilder(Project, 'project')
      .select()
      .leftJoinAndSelect(
        ProjectAuth,
        'auths',
        'auths.project_id = project.project_id',
      )
      .andWhere('auths.accountId = :id', { id: account.id })
      .printSql()
      .getMany();

    // const projects = await this.dataSource.createQueryBuilder()

    console.log(projects);
  }

  create(createStoryDto: CreateStoryDto) {
    return 'This action adds a new story';
  }

  findAll() {
    return `This action returns all story`;
  }

  findOne(id: number) {
    return `This action returns a #${id} story`;
  }

  update(id: number, updateStoryDto: UpdateStoryDto) {
    return `This action updates a #${id} story`;
  }

  remove(id: number) {
    return `This action removes a #${id} story`;
  }
}
