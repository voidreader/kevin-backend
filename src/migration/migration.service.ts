import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EpisodeExtension } from 'src/database/produce_entity/episode-extension.entity';
import { Episode } from 'src/database/produce_entity/episode.entity';
import { ItemExtension } from 'src/database/produce_entity/item-extension.entity';
import { ItemLang } from 'src/database/produce_entity/item-lang.entity';
import { Item } from 'src/database/produce_entity/item.entity';
import { ModelSlave } from 'src/database/produce_entity/model-slave.entity';
import { Model } from 'src/database/produce_entity/model.entity';
import { Nametag } from 'src/database/produce_entity/nametag.entity';
import { ProfileLine } from 'src/database/produce_entity/profile-line.entity';
import { Profile } from 'src/database/produce_entity/profile.entity';
import { SoundResource } from 'src/database/produce_entity/sound-resource.entity';
import { GameUser } from 'src/gamedb/entities/game-user';
import { LiveResourceDetail } from 'src/resource-manager/entities/live-resource-detail.entity';
import { LiveResource } from 'src/resource-manager/entities/live-resource.entity';

import { DataSource, Repository } from 'typeorm';
import { Selection } from 'src/database/produce_entity/selection.entity';
import { Script } from 'src/database/produce_entity/script.entity';
import { Package } from 'src/database/produce_entity/package.entity';
import { PackageClient } from 'src/database/produce_entity/package-client.entity';
import { Product } from 'src/database/produce_entity/product.entity';
import { ProductLang } from 'src/database/produce_entity/product-lang.entity';
import { ProductDetail } from 'src/database/produce_entity/product-detail.entity';
import { Loading } from 'src/database/produce_entity/loading.entity';
import { Emoticon } from 'src/database/produce_entity/emoticon.entity';
import { Dress } from 'src/database/produce_entity/dress.entity';

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
    @InjectRepository(LiveResource)
    private readonly repLiveResource: Repository<LiveResource>,
    @InjectRepository(Nametag)
    private readonly repNametag: Repository<Nametag>,
    @InjectRepository(SoundResource)
    private readonly repSoundResource: Repository<SoundResource>,
    @InjectRepository(Episode)
    private readonly repEpisode: Repository<Episode>,
    @InjectRepository(Script)
    private readonly repScript: Repository<Script>,
    @InjectRepository(Selection)
    private readonly repSelection: Repository<Selection>,
    @InjectRepository(Package)
    private readonly repPackage: Repository<Package>,
    @InjectRepository(PackageClient)
    private readonly repPackageClient: Repository<PackageClient>,

    @InjectRepository(Product)
    private readonly repProduct: Repository<Product>,
    @InjectRepository(Loading)
    private readonly repLoading: Repository<Loading>,
    @InjectRepository(Emoticon)
    private readonly repEmoticon: Repository<Emoticon>,
    @InjectRepository(Dress)
    private readonly repDress: Repository<Dress>,
  ) {}

  // * 의상
  async copyDress(project_id: number) {
    const rows: Dress[] = await this.dataSource.query(`
    SELECT ldm.dressmodel_name speaker
          , ldm.project_id 
          , ld.dress_name
          , ld.model_id
          , ld.is_default
        FROM pier.list_dress_model ldm 
          , pier.list_dress ld 
      WHERE ldm.project_id  = ${project_id}
        AND ld.dressmodel_id  = ldm.dressmodel_id 
      ORDER BY ldm.dressmodel_name, ld.dress_name  
      ;
    `);

    try {
      await this.repDress.save(rows);

      return { isSuccess: true, total: rows.length };
    } catch (error) {
      return { isSuccess: false, error };
    }
  } // ? end copyDress

  // * 이모티콘 migration
  async copyEmoticon(project_id: number) {
    const rows: Emoticon[] = await this.dataSource.query(`
    SELECT a.emoticon_master_id id
        , a.emoticon_owner speaker
        , a.project_id 
      FROM pier.list_emoticon_master a
    WHERE a.project_id = ${project_id};
    `);

    for (const row of rows) {
      row.slaves = await this.dataSource.query(`
      SELECT a.image_name 
          , a.image_url 
          , a.image_key 
          , 'carpestore' image_bucket
        FROM pier.list_emoticon_slave a
      WHERE a.emoticon_master_id  = ${row.id};
      `);
    } // end for

    try {
      await this.repEmoticon.save(rows);

      return { isSuccess: true, total: rows.length };
    } catch (error) {
      return { isSuccess: false, error };
    }
  } // ? end copyEmoticon

  // * 인앱 상품 Migration
  async copyProduct(project_id: number) {
    const products: Product[] = await this.dataSource.query(`
    SELECT a.product_master_id master_id
      , a.product_id 
      , a.name product_name
      , a.product_type 
      , a.from_date 
      , a.to_date 
      , '' exception_cuture
      , a.package project_id
      , a.is_public 
      , '' bonus_name 
      , a.max_count 
    FROM pier.list_product_master a
  WHERE a.package = ${project_id};
    `);

    for (const product of products) {
      product.langs = await this.dataSource.query(`
      SELECT a.lang 
          , a.title 
          , pier.fn_get_design_info(a.banner_id, 'url') banner_url
          , pier.fn_get_design_info(a.banner_id, 'key') banner_key
          , 'carpestore/assets' bucket
        FROM pier.list_product_lang a
        WHERE a.master_id = ${product.master_id};
      `);

      product.details = await this.dataSource.query(`
       SELECT a.is_main 
            , a.quantity 
            , a.first_purchase 
            , i.id item_id
          FROM pier.list_product_detail a
            , produce.item i 
        WHERE a.master_id = ${product.master_id}
          AND i.currency = a.currency 
        ;
       `);
    } // end for

    try {
      await this.repProduct.save(products);

      return { isSuccess: true, totalProduct: products.length };
    } catch (error) {
      return { isSuccess: false, error };
    }
  } // ? END OF copy product

  // * 전체 패키지
  async copyPackages() {
    const packages: Package[] = await this.dataSource.query(`
    SELECT a.*
      FROM pier.com_package_master a
    ;
    `);

    for (const pack of packages) {
      const slaves: PackageClient[] = await this.dataSource.query(`
      SELECT * 
          FROM pier.com_package_client a
        WHERE a.package_id = '${pack.package_id}';
      `);

      pack.clients = slaves;
    }

    try {
      await this.repPackage.save(packages);
      return { isSuccess: true, totalPackage: packages.length };
    } catch (error) {
      return { isSuccess: false, error };
    }
  } // ? END copyPackages

  // * 에피소드 로딩
  async copyEpisodeLoading(project_id: number) {
    const loadings: Loading[] = await this.dataSource.query(`
    SELECT a.loading_id id 
        , a.project_id 
        , a.loading_name 
        , 1 is_public
        , pier.fn_get_design_info(a.image_id, 'url') image_url
        , pier.fn_get_design_info(a.image_id, 'key') image_key
        , 'carpestore/assets' bucket
      FROM pier.list_loading a
    WHERE a.project_id = ${project_id};
    `);

    console.log(`loading count : `, loadings.length);

    for (const loading of loadings) {
      loading.details = await this.dataSource.query(`
      SELECT a.lang 
          , a.loading_text 
        FROM pier.list_loading_detail a
      WHERE a.loading_id = ${loading.id};
      `);

      loading.episodes = await this.dataSource.query(`
      SELECT a.episode_id 
          , a.is_use 
        FROM pier.list_loading_appear  a
      WHERE a.loading_id = ${loading.id};
       `);

      console.log(
        `${loading.id} has ${loading.details.length} details and ${loading.episodes.length} episodes`,
      );
    } // end for

    try {
      await this.repLoading.save(loadings);
      return { isSuccess: true, totalLoading: loadings.length };
    } catch (error) {
      return { isSuccess: false, error };
    }
  } // ? End of copy Episode Loading

  // * 에피소드 및 스크립트
  async copyEpisodeScript(project_id: number) {
    let totalEpisode: number = 0;
    let totalScriptRow: number = 0;

    const originEpisodes: Episode[] = await this.dataSource.query(
      `
    SELECT a.episode_id 
        , a.project_id 
        , a.episode_type 
        , a.title
        , 'draft' episode_status 
        , a.ending_type 
        , a.unlock_style 
        , a.depend_episode 
        , a.chapter_number 
        , a.speaker 
        , a.dlc_id 
      FROM pier.list_episode a
    WHERE a.project_id = ?;
    `,
      [project_id],
    );

    console.log(`total episode : `, originEpisodes.length);

    // * Episode 관련 로직 시작
    for (const episode of originEpisodes) {
      console.log(episode.title);
      episode.details = await this.dataSource.query(
        `
      SELECT a.lang 
          , a.title 
          , a.summary 
        FROM pier.list_episode_detail a
      WHERE a.episode_id  = ?;
      `,
        [episode.episode_id],
      );

      // extension
      const exts: EpisodeExtension[] = await this.dataSource.query(
        `
      SELECT pier.fn_get_design_info(a.popup_image_id, 'url') banner_url
          , pier.fn_get_design_info(a.popup_image_id, 'key') banner_key
          , 'carpestore' bucket
        FROM pier.list_episode a
      WHERE a.episode_id = ?
        AND a.popup_image_id > 0;
      `,
        [episode.episode_id],
      );

      if (exts.length > 0) {
        episode.extension = exts[0];
      }
    } // end for

    // 에피소드 저장
    try {
      await this.repEpisode.save(originEpisodes);
    } catch (error) {
      return { isSuccess: false, error };
    }

    // 스크립트 진행
    for (const episode of originEpisodes) {
      const scripts: Script[] = await this.dataSource.query(
        `
        SELECT a.script_no 
        , a.project_id 
        , a.episode_id 
        , CASE WHEN a.scene_id IS NULL THEN NULL
               WHEN a.scene_id = '' THEN NULL
               ELSE a.scene_id END scene_id 
        , a.template 
        , a.speaker 
        , a.script_data 
        , a.requisite 
        , a.character_expression 
        , a.emoticon_expression 
        , a.in_effect 
        , a.out_effect 
        , a.bubble_size 
        , a.bubble_pos 
        , a.bubble_hold 
        , a.bubble_reverse 
        , a.emoticon_size 
        , a.voice 
        , a.autoplay_row
        , a.sound_effect 
        , a.lang 
        , a.control 
        , a.selection_group 
        , a.selection_no 
        , a.dev_comment 
        , a.target_scene_id 
     FROM pier.list_script a
    WHERE a.episode_id = ?;
      `,
        [episode.episode_id],
      );

      try {
        await this.repScript.save(scripts);
        totalScriptRow += scripts.length;
      } catch (error) {
        return { isSuccess: false, error };
      }

      console.log(`${episode.title} script is done!`);
    }

    const selections: Selection[] = await this.dataSource.query(
      `
    SELECT a.*
      FROM pier.list_selection a
    WHERE a.project_id = ?;
    `,
      [project_id],
    );

    try {
      await this.repSelection.save(selections);
    } catch (error) {
      return { isSuccess: false, error };
    }

    // 리턴
    return {
      isSuccess: true,
      totalEpisode: originEpisodes.length,
      totalScriptRow,
      selection: selections.length,
    };
  } // ? END copyEpisodeScript

  ////////////////////////////////////////////////////

  // * 사운드 리소스 마이그레이션
  async copySoundResource(project_id: number) {
    const originSounds = await this.dataSource.query(
      `
    SELECT ls.project_id 
        , ls.sound_type 
        , ls.sound_name 
        , ls.sound_url 
        , ls.sound_key 
        , ls.bucket 
        , ls.game_volume 
        , ls.is_public 
        , ls.speaker 
    FROM pier.list_sound ls WHERE project_id = ?;
    `,
      [project_id],
    );

    const currentSounds = await this.repSoundResource.find({
      where: { project_id },
    });

    try {
      await this.repSoundResource.remove(currentSounds);

      await this.repSoundResource.save(originSounds);
    } catch (error) {
      return { isSuccess: false, error };
    }

    return { isSuccess: true, total: originSounds.length };
  }

  // * 구 currency, currency_item, 텍스트 정보 불러오기
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

      // item.abilities = await this.dataSource.query(`
      // SELECT cca.ability_id
      //       , cca.add_value
      //     FROM pier.com_currency_ability cca
      //   WHERE cca.currency = '${item.currency}'
      //   ;
      // `);
    } // ? end of for

    console.log('Save Start... items count : ', items.length);

    try {
      await this.repItem.save(items);
    } catch (error) {
      return { isSuccess: false, error };
    }

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
      SELECT a.line_id AS text_id
          , pier.fn_get_motion_name_by_id(a.motion_id) motion_name
          , a.condition_type 
          , a.line_condition 
          , a.sound_name
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

    // * nametag 복사
    const originNametags = await this.dataSource.query(
      `
    SELECT a.project_id 
        , a.speaker 
        , a.main_color 
        , a.sub_color 
        , a.KO
        , a.EN 
        , a.JA 
        , a.AR 
        , '' AS "ID" 
        , a.ES 
        , a.MS 
        , a.RU 
        , a.ZH 
        , a.SC 
      FROM pier.list_nametag a
    WHERE a.project_id = ?;`,
      [project_id],
    );

    await this.repNametag.save(originNametags);

    try {
      await this.repProfile.save(profiles);
    } catch (error) {
      return { isSuccess: false, error };
    }

    return { isSuccess: true, total: profiles.length };
  } // ? END OF copyProfile

  /////////////////////////////////////

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

  // * 라이브 일러스트 카피
  async copyLiveIllust(project_id: number) {
    let result: LiveResource[];

    result = await this.dataSource.query(`
    SELECT a.live_illust_id as id
        , a.project_id 
        , 'live_illust' live_type
        , a.live_illust_name live_name
        , a.offset_x 
        , a.offset_y 
        , a.is_public 
        , a.speaker 
        , a.illust_ver resource_ver
        , a.appear_episode 
        , pier.fn_get_design_info(a.thumbnail_id, 'url') thumbnail_url
        , pier.fn_get_design_info(a.thumbnail_id, 'key') thumbnail_key
        , 'carpestore' bucket
      FROM pier.list_live_illust a
    WHERE a.project_id = ${project_id};
    `);

    for (const model of result) {
      model.offset_x = Math.round(model.offset_x * 10) / 10;
      model.offset_y = Math.round(model.offset_y * 10) / 10;

      let details: LiveResourceDetail[];

      details = await this.dataSource.query(`
      SELECT a.file_url 
        , a.file_key 
        , a.file_name 
        , 'carpestore' bucket
        , a.motion_name 
      FROM pier.list_live_illust_detail a
    WHERE a.live_illust_id = ${model.id};
      `);

      model.details = details;

      console.log(`live details : `, model.details.length);

      model.localizations = await this.dataSource.query(`
      SELECT 'live_illust' resource_type
        , lang 
        , ifnull(public_name, '-') public_name
        , ifnull(summary, '-') summary
      FROM pier.list_illust_lang a
    WHERE a.illust_id = ${model.id} AND a.illust_type = 'live2d';
      `);

      console.log(`live langs : `, model.localizations.length);
    } // end for

    try {
      await this.repLiveResource.save(result);
    } catch (error) {
      return { isSuccess: false, error };
    }

    return { isSuccess: true, total: result.length };
  } // ? END copy live illust

  // * 라이브 오브젝트 카피
  async copyLiveObject(project_id: number) {
    let result: LiveResource[];

    result = await this.dataSource.query(`
    SELECT a.live_object_id as origin_id
        , a.project_id 
        , 'live_object' live_type
        , a.live_object_name live_name
        , a.offset_x 
        , a.offset_y 
        , a.is_public 
        , a.speaker 
        , a.object_ver resource_ver
        , a.appear_episode 
        , pier.fn_get_design_info(a.thumbnail_id, 'url') thumbnail_url
        , pier.fn_get_design_info(a.thumbnail_id, 'key') thumbnail_key
        , 'carpestore' bucket
      FROM pier.list_live_object a
    WHERE a.project_id = ${project_id};
    `);

    for (const model of result) {
      model.offset_x = Math.round(model.offset_x * 10) / 10;
      model.offset_y = Math.round(model.offset_y * 10) / 10;

      let details: LiveResourceDetail[];

      details = await this.dataSource.query(`
      SELECT a.file_url 
          , a.file_key 
          , a.file_name 
          , 'carpestore' bucket
          , a.motion_name 
        FROM pier.list_live_object_detail a
      WHERE a.live_object_id = ${model.origin_id};
      `);

      model.details = details;

      model.localizations = await this.dataSource.query(`
      SELECT 'live_object' resource_type
      , lang 
      , ifnull(public_name, '-') public_name
      , ifnull(summary, '-') summary
    FROM pier.list_minicut_lang a
  WHERE a.minicut_id = ${model.origin_id} AND a.minicut_type = 'live2d';
      `);
    } // end for

    try {
      await this.repLiveResource.save(result);
    } catch (error) {
      return { isSuccess: false, error };
    }

    return { isSuccess: true, total: result.length };
  } // ? END copy live object
} // ? End of class
