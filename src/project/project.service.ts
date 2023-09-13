import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProjectInputDto,
  EpisodeListOutputDto,
  ProjectOutputDto,
  SingleProjectOutputDto,
  UpdateEpisodeSortingInputDto,
  UpdateProjectInputDto,
} from './dto/project.dto';

import { PRODUCE_DATASOURCE } from 'src/common/common.const';
import { DataSource, In, LessThan, MoreThan, Repository } from 'typeorm';
import { Account, UserRole } from 'src/database/produce_entity/account.entity';
import {
  Project,
  ProjectType,
} from 'src/database/produce_entity/project.entity';
import { ProjectAuth } from 'src/account/entities/projectAuth.entity';
import { ProjectDetail } from 'src/database/produce_entity/project-detail.entity';
import { error } from 'console';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from 'src/database/produce_entity/episode.entity';
import { Script } from 'vm';

@Injectable()
export class ProjectService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Project) private readonly repProject: Repository<Project>,
    @InjectRepository(ProjectDetail)
    private readonly repProjectDetail: Repository<ProjectDetail>,
    @InjectRepository(ProjectAuth)
    private readonly repProjectAuth: Repository<ProjectAuth>,
    @InjectRepository(Episode)
    private readonly repEpisode: Repository<Episode>,
    @InjectRepository(Script)
    private readonly repScript: Repository<Script>,
  ) {}

  // * 단일 에피소드 업데이트
  async updateSingleEpisode(episode: Episode) {}

  // * 유저의 언어별 프로젝트 아이콘 업로드
  async uploadProjectIcon(file: Express.MulterS3.File, detail: ProjectDetail) {
    let newDetail = this.repProjectDetail.create(detail);

    if (file) {
      const { location, key, bucket } = file;

      detail.icon_url = location;
      detail.icon_key = key;
      detail.icon_bucket = bucket;
    }

    try {
      newDetail = await this.repProjectDetail.save(detail);
      return { isSuccess: true, lang: detail.lang, detail: newDetail };
    } catch (error) {
      return { isSuccess: false, error };
    }
  } // ? END uploadProjectIcon

  // * 에피소드 재정렬
  async updateEpisodeSorting(
    inputDto: UpdateEpisodeSortingInputDto,
  ): Promise<EpisodeListOutputDto> {
    let newOrder = 1;

    // chapter 들의 number 재부여
    inputDto.episodes.forEach((episode) => {
      if (episode.episode_type == 'chapter') {
        episode.chapter_number = newOrder++;
      }
    });

    try {
      const episodes = await this.repEpisode.save(inputDto.episodes);
      return { isSuccess: true, episodes };
    } catch (error) {
      return {
        isSuccess: false,
        error,
      };
    }
  } // ? 재정렬 종료

  // * 스토리 에피소드 리스트 조회
  async getEpisodeList(project_id: number) {
    const organized: Episode[] = [];

    const chapters: Episode[] = [];
    const endings: Episode[] = [];
    const sides: Episode[] = [];

    const episodes: Episode[] = await this.repEpisode.find({
      where: { project_id, dlc_id: LessThan(0) },
      order: {
        episode_type: 'ASC',
        chapter_number: 'ASC',
      },
    });

    // 순서 재조정 진행.
    episodes.forEach((episode) => {
      if (episode.episode_type == 'chapter') {
        episode.indexed_title = `[${episode.chapter_number}] ${episode.title}`;

        chapters.push(episode);
      } else if (episode.episode_type == 'ending') {
        episode.indexed_title = `[Ending] ${episode.title}`;
        endings.push(episode);
      } else {
        episode.indexed_title = `[Special] ${episode.title}`;
        sides.push(episode);
      }
    });

    // chapter와 귀속된 엔딩을 더해준다.
    chapters.forEach((chapter) => {
      organized.push(chapter);

      endings.forEach((ending) => {
        if (ending.depend_episode == chapter.episode_id) organized.push(ending);
      });
    });

    // 귀속되지 않은 엔딩을 넣어주기.
    endings.forEach((ending) => {
      if (!organized.includes(ending)) organized.push(ending);
    });

    sides.forEach((side) => {
      organized.push(side);
    });

    return { isSuccess: true, episodes: organized };
  }

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
