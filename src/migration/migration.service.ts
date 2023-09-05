import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemExtension } from 'src/database/produce_entity/item-extension.entity';
import { ItemLang } from 'src/database/produce_entity/item-lang.entity';
import { Item } from 'src/database/produce_entity/item.entity';
import { ModelSlave } from 'src/database/produce_entity/model-slave.entity';
import { Model } from 'src/database/produce_entity/model.entity';
import { ProfileLine } from 'src/database/produce_entity/profile-line.entity';
import { Profile } from 'src/database/produce_entity/profile.entity';
import { GameUser } from 'src/gamedb/entities/game-user';
import { text } from 'stream/consumers';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MigrationService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(GameUser, 'game')
    private readonly repUser: Repository<GameUser>,
    @InjectRepository(Model)
    private readonly repModel: Repository<Model>,
    @InjectRepository(Profile)
    private readonly repProfile: Repository<Profile>,
    @InjectRepository(Item)
    private readonly repItem: Repository<Item>,
    @InjectRepository(ItemLang)
    private readonly repItemLang: Repository<ItemLang>,
  ) {}

  // * 구 currency, currentcy_item, 텍스트 정보 불러오기
  async copyItem(project_id: number) {
    let items: Item[];

    items = await this.dataSource.query(
      `
    SELECT a.origin_name 
        , a.currency_type AS item_type
        , a.connected_project AS project_id
        , a.is_unique 
        , a.consumable AS is_consumable
        , a.is_use AS is_active
        , a.is_ability 
        , pier.fn_get_design_info(a.icon_image_id , 'url') icon_url
        , pier.fn_get_design_info(a.icon_image_id, 'key') icon_key
        , pier.fn_get_design_info(a.resource_image_id, 'url') image_url
        , pier.fn_get_design_info(a.resource_image_id, 'key') image_key
        , a.model_id AS resource_id 
        , a.currency
    FROM pier.com_currency a
    WHERE connected_project = ?;    
    `,
      [project_id],
    );

    for (const item of items) {
      // localizations.
      const queryResult = await this.dataSource.query(
        `
            SELECT tl.*
        FROM pier.com_currency cc
          , text_localize tl 
      WHERE cc.connected_project = ?
        AND cc.currency = ?
        AND tl.text_id = cc.local_code
      
      `,
        [project_id, item.currency],
      );

      if (queryResult.length > 0) {
        const textRow = queryResult[0]; // textRow 가져와서.
        // console.log(textRow);

        // 3개 언어 무조건 넣어주기.
        item.localizations = [];
        item.localizations.push(
          this.repItemLang.create({
            lang: 'KO',
            item_name: textRow.KO,
          }),
        );
        item.localizations.push(
          this.repItemLang.create({
            lang: 'EN',
            item_name: textRow.EN,
          }),
        );
        item.localizations.push(
          this.repItemLang.create({
            lang: 'JA',
            item_name: textRow.JA,
          }),
        );
      }

      // extension
      // com_coin_product..
      let extensions: ItemExtension[];
      extensions = await this.dataSource.query(
        `
          SELECT a.product_type 
        , a.price 
        , a.sale_price 
        , a.start_date as sale_start_date
        , a.end_date AS sale_end_date
        , a.is_public 
        , ifnull(a.connected_bg, -1) AS static_id
      FROM pier.com_coin_product a
    WHERE a.currency = ?;
      `,
        [item.currency],
      );

      if (extensions.length > 0) {
        item.extension = extensions[0];
      }

      try {
        console.log(item);
        await this.repItem.save(item);
      } catch (error) {
        return { isSuccess: false, error };
      }
    } // ? end of for

    console.log('Save Start... items count : ', items.length);

    // try {
    //   await this.repItem.save(items);

    // } catch (error) {
    //   return { isSuccess: false, error };
    // }

    return { isSuccess: true, total: items.length };
  } // ? end of copy item

  // * 구 Profile, 능력치, 프로필 대사 등 Migration
  async copyProfile(project_id: number) {
    let profiles: Profile[];

    profiles = await this.dataSource.query(
      `
    SELECT a.ability_id AS id
        , a.project_id 
        , a.speaker 
        , a.profile_height 
        , a.profile_age 
        , a.profile_birth_date 
        , a.profile_favorite_id 
        , a.profile_hate_id 
        , a.profile_line_id 
        , a.profile_introduce_id 
    FROM pier.com_ability a
    WHERE a.project_id = ?;    
    `,
      [project_id],
    );

    for (const profile of profiles) {
      profile.lines = await this.dataSource.query(
        `
      SELECT a.ability_id AS profile_id
          , a.line_id AS text_id
          , pier.fn_get_motion_name_by_id(a.motion_id) motion_name
          , a.condition_type 
          , a.line_condition 
        FROM pier.com_profile_lines a
      WHERE a.ability_id = ?;`,
        [profile.id],
      );

      profile.abilities = await this.dataSource.query(
        `
      SELECT a.ability_name 
          , a.min_value  
          , a.max_value  
          , a.is_main 
          , a.local_id 
        FROM pier.com_ability a
      WHERE a.speaker = ?
        AND a.project_id = ?;
      `,
        [profile.speaker, project_id],
      );
    }

    try {
      await this.repProfile.save(profiles);
    } catch (error) {
      return { isSuccess: false, error };
    }

    return { isSuccess: true, total: profiles.length };
  } // ? END OF copyProfile

  // list_model, slave, motion 가져오기
  async copyModels(project_id: number) {
    let result: Model[];

    result = await this.dataSource.query(
      `
    SELECT a.* 
      FROM pier.list_model_master a
    WHERE a.project_id = ?
    ORDER BY a.model_id ;`,
      [project_id],
    );

    // slave-motion 조회

    for (const model of result) {
      model.offset_x = Math.round(model.offset_x * 10) / 10;
      model.offset_y = Math.round(model.offset_y * 10) / 10;

      // model 정보를 기반으로 구 slave-motion 데이터 가져오기
      let slaves: ModelSlave[];

      slaves = await this.dataSource.query(`
        SELECT lms.*
            , lmm.motion_name
        FROM pier.list_model_slave lms
        LEFT OUTER JOIN pier.list_model_motion lmm on lms.model_id = lmm.model_id AND lms.file_key = lmm.file_key 
      WHERE lms.model_id = ${model.model_id};
      `);

      model.slaves = slaves;
    }

    try {
      await this.repModel.save(result);
    } catch (error) {
      return { isSuccess: false, error };
    }

    return { isSuccess: true, total: result.length };

    // 다했으면 저장.
  } // ? END of copyModels

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
