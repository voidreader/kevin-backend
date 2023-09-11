import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProjectInputDto,
  ProjectOutputDto,
  SingleProjectOutputDto,
  UpdateProjectInputDto,
} from './dto/project.dto';

import { PRODUCE_DATASOURCE } from 'src/common/common.const';
import { DataSource, In, Repository } from 'typeorm';
import { Account, UserRole } from 'src/database/produce_entity/account.entity';
import {
  Project,
  ProjectType,
} from 'src/database/produce_entity/project.entity';
import { ProjectAuth } from 'src/account/entities/projectAuth.entity';
import { ProjectDetail } from 'src/database/produce_entity/project-detail.entity';
import { error } from 'console';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Project) private readonly repProject: Repository<Project>,
    @InjectRepository(ProjectAuth)
    private readonly repProjectAuth: Repository<ProjectAuth>,
  ) {}

  // * 유저와 연계된 프로젝트 리스트 조회
  async getAlternativeStoryList(account: Account) {
    const result = {
      projects: [],
      isSuccess: false,
    };

    // 기본 쿼리
    let query: string = `
      SELECT a.project_id 
      , a.default_lang 
      , b.title 
      , a.project_state 
      , a.bubble_set_id 
      , cbm.set_name bubble_set_name
    FROM project a
      , project_detail b
      , pier.com_bubble_master cbm 
  WHERE b.project_id = a.project_id 
    AND b.lang = a.default_lang 
    AND cbm.set_id = a.bubble_set_id     
    `;

    const orderBy = ` ORDER BY a.sortkey , a.project_id;`;
    const authCondition = ` AND a.project_id IN (SELECT z.project_id FROM project_auth z WHERE z.accountId = ?)`;

    if (account.role == UserRole.Admin) {
      query += orderBy;
    } else {
      query += authCondition;
      query += orderBy;
    }

    result.projects = await this.dataSource.query(query, [account.id]);
    result.isSuccess = true;

    return result;
  }

  // * 권한에 따른 작품 리스트 조회
  async getStoryList(account: Account): Promise<ProjectOutputDto> {
    let projects: Project[];
    let auths: ProjectAuth[];

    console.log(`Start getStoryList...`);

    // * Admin과 일반 유저 분리
    if (account.role == UserRole.Admin) {
      projects = await this.repProject.find({
        where: { project_type: ProjectType.Otome },
        order: { project_id: 'DESC' },
      });

      // projects = await this.dataSource
      //   .createQueryBuilder(Project, 'project')
      //   .select()
      //   .leftJoinAndSelect(
      //     ProjectAuth,
      //     'auths',
      //     'auths.project_id = project.project_id',
      //   )
      //   .andWhere('auths.accountId = :id', { id: account.id })
      //   .orderBy('project.sortkey')
      //   .getMany();
    } else {
      console.log(`User's Project list!!`);

      auths = await this.repProjectAuth.find({
        relations: { account: true },
        where: {
          account: {
            id: account.id,
          },
        },
      });

      console.log(auths);

      const projectAuthArray = [];
      auths.forEach((item) => projectAuthArray.push(item.project_id));

      projects = await this.repProject.findBy({
        project_id: In(projectAuthArray),
      });
    }

    projects.forEach((p) => {
      p.title = this.getProjectDefaultTitle(p);
      p.icon_url = this.getProjectDefaultIcon(p);
    });

    return {
      isSuccess: true,
      projects,
    };
  } // ? getStoryList END

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
      newProject = repProject.create(createStoryDto);
      // detail
      const newDetail = repProjectDetail.create();
      newDetail.lang = newProject.default_lang;
      newDetail.title = newProject.title;
      newDetail.project = newProject;
      newDetail.writer = account.organization;

      newProject.projectDetails = [];
      newProject.projectDetails.push(newDetail);

      newProject = await repProject.save(newProject);
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

      await repAuth.save(auth);
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
    let modifiedProject: Project;

    try {
      modifiedProject = await repProject.save(inputDto);
    } catch (error) {
      return { isSuccess: false, error };
    }

    const output = new SingleProjectOutputDto();
    output.isSuccess = true;
    output.project = modifiedProject;

    return output;
  } // ? end of update

  findAll() {
    return `This action returns all story`;
  }

  // * 작품 상세 정보 조회
  async findOne(id: number): Promise<SingleProjectOutputDto> {
    const repProject = this.dataSource.getRepository(Project);
    const project = await repProject.findOneBy({ project_id: id });

    project.title = this.getProjectDefaultTitle(project);
    project.icon_url = this.getProjectDefaultIcon(project);

    const output = new SingleProjectOutputDto();
    output.isSuccess = true;
    output.project = project;

    // console.log(project);

    return output;
  } // ? end of findOne

  // update(id: number, updateStoryDto: UpdateStoryDto) {
  //   return `This action updates a #${id} story`;
  // }

  remove(id: number) {
    return `This action removes a #${id} story`;
  }

  // 작품의 default title 구해오기.
  getProjectDefaultTitle(project: Project): string {
    let projectTitle: string = '';

    if (project.projectDetails) {
      project.projectDetails.forEach((item) => {
        if (item.lang == project.default_lang) {
          projectTitle = item.title;
        }
      });
    }

    return projectTitle;
  }

  getProjectDefaultIcon(project: Project): string {
    let iconURL: string = '';
    if (project.projectDetails) {
      project.projectDetails.forEach((item) => {
        if (item.lang == project.default_lang) {
          iconURL = item.icon_url;
        }
      });
    }

    return iconURL;
  }
}
