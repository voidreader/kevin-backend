import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StandardInfo } from './entities/standard-info.entity';
import { DataSource, Repository } from 'typeorm';
import { winstonLogger } from '../util/winston.config';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(StandardInfo)
    private readonly repStandard: Repository<StandardInfo>,
    private readonly dataSource: DataSource,
  ) {}

  async getStandard(standard_class: string) {
    return await this.dataSource
      .createQueryBuilder(StandardInfo, 'std')
      .select()
      .where(`standard_class = '${standard_class}'`)
      .orderBy('std.sortkey')
      .getMany();

    // return this.repStandard.find({ where: { standard_class } });
  }

  async getLocalizedStandard(standard_class: string, lang: string = 'EN') {
    return await this.dataSource.query(`
    SELECT si.code 
        , produce.fn_get_localize_text(si.text_id, '${lang}') code_name
    FROM produce.standard_info si
    WHERE si.standard_class = '${standard_class}';
    `);
  }

  // * 말풍선 세트 dropdown
  async getAvailableBubbleSet(lang: string = 'EN') {
    winstonLogger.debug(`getAvailableBubbleSet called`);

    // 구 버전 데이터베이스 그대로 사용. 나중에 이관
    return await this.dataSource.query(`
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

  // 스크립트 편집기에서 사용하는 템플릿 리스트
  getScriptTemplateList(lang: string) {
    return this.dataSource.query(`
    SELECT si.code
         , si.code_name
         , si.extra
         , si.sortkey
      FROM standard_info si  WHERE si.standard_class = 'script_template' ORDER BY  extra, sortkey ;
    `);
  }

  getScriptMotionList(project_id: number) {
    return this.dataSource.query(`
    SELECT a.model_name , ms.motion_name 
      FROM model a
        , model_slave ms 
    WHERE a.project_id = ${project_id}
      AND ms.model_id = a.model_id
      AND ms.is_motion > 0
      AND ms.motion_name NOT LIKE '%_M'
    ORDER BY a.model_name, ms.motion_name
    ;
    `);
  }

  getScripEmoticonList(project_id: number) {
    return this.dataSource.query(`
    SELECT e.speaker, es.image_name AS emoticon
    FROM emoticon e
       , emoticon_slave es 
   WHERE e.project_id = ${project_id}
     AND es.master_id = e.id;
    `);
  }

  getScriptSpeakerList(project_id: number) {
    return this.dataSource.query(`
    SELECT z.speaker, z.data_source
      FROM (
    SELECT a.speaker 
        , 'profile' data_source
      FROM profile a 
    WHERE a.project_id = ${project_id}
    UNION all 
    SELECT n.speaker
        , 'tag' data_source
      FROM nametag n
    WHERE n.project_id = ${project_id}
    ) z
    ORDER BY z.data_source, z.speaker
    ;
    `);
  }

  getProjectAbilityList(project_id: number) {
    return this.dataSource.query(`
    SELECT a.ability_id 
   , CONCAT('[', p.speaker, '] ', a.ability_name) AS ability_name
FROM ability a
   , profile p 
WHERE p.project_id = ${project_id}
 AND a.profile_id = p.id;
    `);
  }

  getProjectAbilityListCode(project_id: number) {
    return this.dataSource.query(`
    SELECT 0 code
     , '선택되지 않음' code_name
    FROM DUAL
  UNION ALL
      SELECT a.ability_id code
    , CONCAT('[', p.speaker, '] ', a.ability_name) AS code_name
  FROM ability a
    , profile p 
  WHERE p.project_id = ${project_id}
  AND a.profile_id = p.id;
    `);
  }

  getProjectMinicutList(project_id: number) {
    return this.dataSource.query(`
    SELECT ssi.id code
     , ssi.image_name code_name
  FROM story_static_image ssi 
 WHERE ssi.project_id = ${project_id}
   AND ssi.image_type = 'minicut';
    `);
  }
  getProjectBackgroundDropdown(project_id: number) {
    return this.dataSource.query(`
    SELECT ssi.id code
    , ssi.image_name code_name
 FROM story_static_image ssi 
WHERE ssi.project_id = ${project_id}
  AND ssi.image_type = 'bg';
    `);
  }

  // * 한방에 가져오기...
  async getScriptResourceInfo(project_id: number) {
    // * 캐릭터, 이모티콘, 모션, static images
    const [speakers, emoticons, motions, images] = await Promise.all([
      this.dataSource.query(`
    SELECT z.speaker, z.data_source
      FROM (
            SELECT a.speaker 
                , 'profile' data_source
              FROM profile a 
            WHERE a.project_id = ${project_id}
            UNION all 
            SELECT n.speaker
                , 'tag' data_source
              FROM nametag n
            WHERE n.project_id = ${project_id}
            ) z
    ORDER BY z.data_source, z.speaker;`),
      this.dataSource.query(`
    SELECT e.speaker, es.image_name AS emoticon
      FROM emoticon e
        , emoticon_slave es 
    WHERE e.project_id = ${project_id}
      AND es.master_id = e.id;`),

      this.dataSource.query(`
      SELECT a.model_name , ms.motion_name 
        FROM model a
          , model_slave ms 
      WHERE a.project_id = ${project_id}
        AND ms.model_id = a.model_id
        AND ms.is_motion > 0
        AND ms.motion_name NOT LIKE '%_M'
      ORDER BY a.model_name, ms.motion_name;`),

      this.dataSource.query(`
        SELECT ssi.image_name
             , ssi.image_type
        FROM story_static_image ssi 
        WHERE ssi.project_id = ${project_id}
          AND ssi.image_type in ('bg', 'minicut', 'illust');
        `),
    ]);

    return { speakers, emoticons, motions, images };
  } // ? END getScriptResourceInfo

  async getKevinStandards(lang: string = 'KO') {
    console.log(`getKevinStandards :: `, lang);

    return {
      bubbleSet: await this.getAvailableBubbleSet(lang),
      primeCurrency: await this.getLocalizedStandard('prime_currency', lang),
      projectType: await this.getStandard('project_type'),
      supportLang: await this.getStandard('produce-lang'),
      appLang: await this.getStandard('app-lang'),
    };
  }
}
