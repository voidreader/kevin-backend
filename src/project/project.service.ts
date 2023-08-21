import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProjectInputDto,
  ProjectOutputDto,
  SingleProjectOutputDto,
  UpdateProjectInputDto,
} from './dto/project.dto';

import { PRODUCE_DATASOURCE } from 'src/common/common.const';
import { DataSource, Repository } from 'typeorm';
import { Account, UserRole } from 'src/database/produce_entity/account.entity';
import { Project } from 'src/database/produce_entity/project.entity';
import { ProjectAuth } from 'src/account/entities/projectAuth.entity';
import { ProjectDetail } from 'src/database/produce_entity/project-detail.entity';
import { error } from 'console';

@Injectable()
export class ProjectService {
  constructor(private readonly dataSource: DataSource) {}

  // * 권한에 따른 작품 리스트 조회
  async getStoryList(account: Account): Promise<ProjectOutputDto> {
    // const rawData = await dataSource.query(`SELECT * FROM USERS`)

    // console.log(`requestStoryList : `, account);
    // console.log(`mainDataSource : `, this.dataSource.options.entities);
    // console.log(`subDataSource : `, this.subDataSource);

    let projects: Project[];

    // * Admin과 일반 유저 분리
    if (account.role == UserRole.Admin) {
      projects = await this.dataSource
        .createQueryBuilder(Project, 'project')
        .select()
        .leftJoinAndSelect(
          ProjectAuth,
          'auths',
          'auths.project_id = project.project_id',
        )
        .andWhere('auths.accountId = :id', { id: account.id })
        .orderBy('project.sortkey')
        .getMany();
    } else {
      projects = await this.dataSource
        .createQueryBuilder(Project, 'project')
        .select()
        .orderBy('project.sortkey')
        .getMany();
    }

    // const projects = await this.dataSource.createQueryBuilder()

    return {
      isSuccess: true,
      projects,
    };
  }

  // * 작품 생성
  async create(
    account: Account,
    createStoryDto: CreateProjectInputDto,
  ): Promise<ProjectOutputDto> {
    // auth,

    // repos
    const repProject = this.dataSource.getRepository(Project);
    const repProjectDetail = this.dataSource.getRepository(ProjectDetail);
    let newProject;
    // 신규 프로젝트 저장
    try {
      newProject = await repProject.save(repProject.create(createStoryDto));

      // detail save
      const newDetail = repProjectDetail.create();
      newDetail.lang = newProject.default_lang;
      newDetail.title = newProject.title;
      newDetail.project = newProject;
      newDetail.writer = account.organization;
      repProjectDetail.save(newDetail);
    } catch (error) {
      return {
        isSuccess: false,
        error: `Failed to save new project : ${JSON.stringify(error)} `,
      };
    }

    try {
      // auth save
      // 권한에 귀속 시킨다.
      const repAuth = this.dataSource.getRepository(ProjectAuth);
      const auth = repAuth.create();
      auth.account = account;
      auth.project_id = newProject.project_id;
      auth.auth_kind = 'update';

      repAuth.save(auth);
    } catch (error) {
      return {
        isSuccess: false,
        error: `Failed to save new project auth : ${JSON.stringify(error)} `,
      };
    }

    return await this.getStoryList(account);
  } // ? end of create

  // * 프로젝트 업데이트
  async update(
    __project_id: number,
    inputDto: UpdateProjectInputDto,
  ): Promise<SingleProjectOutputDto> {
    const repProject = this.dataSource.getRepository(Project);
    const repProjectDetail = this.dataSource.getRepository(ProjectDetail);
    const details: ProjectDetail[] = [];

    const project = await repProject.findOneBy({ project_id: __project_id });

    console.log(`## project : `, project);

    // 프로젝트가 없으면
    if (!project) {
      return { isSuccess: false, error: 'Inavlid project param' };
    }

    // 프로젝트 메인의 값 수정
    project.bubble_set_id = inputDto.bubble_set_id;
    project.prime_currency_text_id = inputDto.prime_currency_text_id;
    // 상세정보는 eager:true로 같이 불러온다. (project.projectDetails)

    // detail 처리
    inputDto.details.forEach((detail) => {
      if (detail.title) {
        // console.log(detail.lang);

        detail.project = project; // 프로젝트 연결해주고

        const matchDetail = project.projectDetails.find(
          (item) => item.lang === detail.lang,
        );

        console.log(`## matchDetail : `, matchDetail);

        // 같은 lang 이 있으면 id 할당.
        if (matchDetail) {
          console.log(`find id!`);
          detail.id = matchDetail.id;
        }

        details.push(detail); // push
      }
    });

    console.log(`## save details : `, details);

    // detail 저장
    if (details.length > 0) repProjectDetail.save(details);

    repProject.save(project);

    return { project, isSuccess: true };
  } // ? end of update

  findAll() {
    return `This action returns all story`;
  }

  // * 작품 상세 정보 조회
  async findOne(id: number) {
    const repProject = this.dataSource.getRepository(Project);
    const project = await repProject.findOneBy({ project_id: id });
    console.log(project);

    return project;
  } // ? end of findOne

  // update(id: number, updateStoryDto: UpdateStoryDto) {
  //   return `This action updates a #${id} story`;
  // }

  remove(id: number) {
    return `This action removes a #${id} story`;
  }
}
