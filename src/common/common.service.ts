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
    return this.dataSource.query(`
    SELECT si.code 
        , produce.fn_get_localize_text(si.text_id, '${lang}') code_name
    FROM produce.standard_info si
    WHERE si.standard_class = '${standard_class}';
    `);
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

  // * 프로젝트 모델 dropdown
  getProjectModelDowndown(project_id: number): Promise<any> {
    return this.dataSource.query(`
    SELECT m.model_id code
        , m.model_name code_name
      FROM produce.model m
    WHERE m.project_id = ${project_id}
    ORDER BY m.model_name;
    `);
  }

  // * 프로젝트 캐릭터 dropdown
  getProjectCharacterDropdown(project_id: number): Promise<any> {
    return this.dataSource.query(`
    SELECT p.speaker code
        , p.speaker code_name
      FROM profile p 
      WHERE p.is_main > 0
      AND p.project_id = ${project_id};
    `);
  }

  getProjectCharacterModel(project_id: number, speaker: string) {}

  // * 프로젝트 캐릭터 모션
  getProjectCharacterMotionDropdown(project_id: number, speaker: string) {
    return this.dataSource.query(`
    SELECT DISTINCT b.motion_name code
         , b.motion_name code_name
      FROM model a
        , model_slave b 
    WHERE a.model_name = '${speaker}' 
      AND a.project_id = ${project_id}
      AND b.model_id = b.model_id  
      AND b.is_motion > 0
 ;
    `);
  }

  // * 프로젝트 에피소드 dropdown (DLC 제외)
  getProjectEpisodeDropdown(project_id: number, dlc_id: number): Promise<any> {
    return this.dataSource.query(`
    SELECT e.episode_id code
        , CASE WHEN e.episode_type ='ending' THEN concat('Ending. ', e.title)
                WHEN e.episode_type ='side' THEN concat('Special. ', e.title)
                ELSE concat('Chapter ', e.chapter_number, '. ', e.title) END code_name
      FROM produce.episode e
    WHERE e.project_id = ${project_id}
      AND e.dlc_id = ${dlc_id}
    ORDER BY e.dlc_id, e.episode_type , e.chapter_number;
    `);
  }

  getScriptTemplateList(lang: string) {
    return this.dataSource.query(`
    SELECT si.code
         , si.code_name
         , si.extra
         , si.sortkey
      FROM standard_info si  WHERE si.standard_class = 'script_template' ORDER BY  extra, sortkey ;
    `);
  }
}
