import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  RESOURCE_BG,
  RESOURCE_ILLUST,
  RESOURCE_MINICUT,
} from 'src/common/common.const';

import {
  OLD_Q_COPY_LIST_BG,
  OLD_Q_COPY_LIST_ILLUST,
  OLD_Q_COPY_LIST_ILLUST_LANG,
  OLD_Q_COPY_LIST_ILLUST_THUMBNAIL,
  OLD_Q_COPY_LIST_MINICUT,
  OLD_Q_COPY_LIST_MINICUT_LANG,
  OLD_Q_COPY_LIST_MINICUT_THUMBNAIL,
} from 'src/common/origin-schema.query';

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
import { TextLocalize } from 'src/common/entities/text-localize.entity';
import { ProfileLineLang } from 'src/database/produce_entity/profile-line-lang.entity';
import { Project } from 'src/database/produce_entity/project.entity';
import { ProjectDetail } from 'src/database/produce_entity/project-detail.entity';
import { AbilityLang } from 'src/database/ability-lang.entity';
import { ProfileLang } from 'src/database/produce_entity/profile-lang.entity';
import { StoryStaticImage } from 'src/resource-manager/entities/story-static-image.entity';
import { PublicExtension } from 'src/resource-manager/entities/public-extension.entity';
import { ImageLocalization } from 'src/resource-manager/entities/image-localization.entity';

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
    @InjectRepository(TextLocalize)
    private readonly repTextLocalize: Repository<TextLocalize>,
    @InjectRepository(ProfileLineLang)
    private readonly repProfileLineLang: Repository<ProfileLineLang>,
    @InjectRepository(ProfileLine)
    private readonly repProfileLine: Repository<ProfileLine>,
    @InjectRepository(Project)
    private readonly repProject: Repository<Project>,
    @InjectRepository(AbilityLang)
    private readonly repAbilityLang: Repository<AbilityLang>,

    @InjectRepository(ProfileLang)
    private readonly repProfileLang: Repository<ProfileLang>,

    @InjectRepository(StoryStaticImage)
    private readonly repStoryStaticImage: Repository<StoryStaticImage>,
    @InjectRepository(PublicExtension)
    private readonly repPublicExtension: Repository<PublicExtension>,
    @InjectRepository(ImageLocalization)
    private readonly repImageLocalization: Repository<ImageLocalization>,
  ) {}

  // * 프로젝트 마스터 마이그레이션
  async copyProject(project_id: number) {
    const projectList: Project[] = await this.dataSource.query(`
    SELECT a.project_id
        , 'Otome' project_type
        , a.default_lang 
        , 'Draft' project_state
        , b.title 'title'
        , a.sortkey 
        , a.bubble_set_id 
        , 2001 prime_currency_text_id
      FROM pier.list_project_master a
        , pier.list_project_detail b
    WHERE b.project_id = a.project_id 
      AND b.lang = a.default_lang
      AND a.project_id = ${project_id};
    `);

    if (projectList.length == 0) {
      throw new HttpException('프로젝트 정보 없음', HttpStatus.BAD_REQUEST);
    }

    const project: Project = projectList[0];

    const detailList: ProjectDetail[] = await this.dataSource.query(`
    SELECT b.lang 
        , b.title 
        , b.summary 
        , b.writer 
        , b.original
        , b.translator 
      FROM pier.list_project_master a
        , pier.list_project_detail b
    WHERE b.project_id = a.project_id 
      AND a.project_id = ${project_id};
    `);

    if (detailList.length == 0) {
      throw new HttpException(
        '프로젝트 상세 정보 없음',
        HttpStatus.BAD_REQUEST,
      );
    }

    project.projectDetails = detailList;

    try {
      await this.repProject.save(project);

      return { message: '프로젝트 마이그레이션 완료!' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '프로젝트 마이그레이션 실패',
        HttpStatus.BAD_REQUEST,
        { description: error },
      );
    }
  } // ? END copyProject

  // * 의상
  async copyDress(project_id: number) {
    const produceList = await this.repDress.find({ where: { project_id } });
    await this.repDress.remove(produceList);

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
    const produceEmoticon: Emoticon[] = await this.repEmoticon.find({
      where: { project_id },
    });

    console.log(`produce 이모티콘 삭제`);
    await this.repEmoticon.remove(produceEmoticon);

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
      console.log(`이모티콘 복사 시작`);
      await this.repEmoticon.save(rows);
      console.log(`이모티콘 복사 종료`);
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
    const produceList = await this.repLoading.find({ where: { project_id } });
    await this.repLoading.remove(produceList);

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
    console.log('매우매우 중요한 에피소드 및 스크립트 복사를 시작합니다');

    console.log('프로듀스에 등록된 에피소드 및 스크립트, 선택지 정보 삭제');
    const produceEpisodes = await this.repEpisode.find({
      where: { project_id },
    });
    const produceScripts = await this.repScript.find({ where: { project_id } });
    const produceSelections = await this.repSelection.find({
      where: { project_id },
    });

    try {
      await this.repEpisode.remove(produceEpisodes);
      await this.repScript.remove(produceScripts);
      await this.repSelection.remove(produceSelections);
    } catch (error) {
      console.log(error);
      throw new HttpException('삭제하다 에러남!', HttpStatus.BAD_REQUEST);
    }
    console.log('기존 데이터 (에피소드, 스크립트, 선택지) 삭제 완료');

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
      // console.log(episode.title);
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
      console.log('에피소드 복사 시작!');
      await this.repEpisode.save(originEpisodes);
      console.log('에피소드 복사 종료!');
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
    console.log('프로듀스 사운드 리소스 삭제');
    const produceSounds = await this.repSoundResource.find({
      where: { project_id },
    });
    await this.repSoundResource.remove(produceSounds); // 삭제
    console.log('프로듀스 사운드 리소스 완료');

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
    const produceItems: Item[] = await this.repItem.find({
      where: { project_id, is_prime: false },
    });

    // 입력된 produce 아이템을 삭제한다.
    await this.repItem.remove(produceItems);

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
        , ifnull(cca.ability_id, 0) ability_id
        , ifnull(cca.add_value, 0) ability_value
    FROM pier.com_currency a
    LEFT OUTER JOIN  pier.com_currency_ability cca ON cca.currency = a.currency
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
  // * 구 버전의 Profile(com_ability)는 profile, ability, profile_line 등으로 쪼개진다.
  async copyProfile(project_id: number) {
    let profiles: Profile[]; // 구 데이터베이스
    const produceProfiles: Profile[] = await this.repProfile.find({
      where: { project_id },
    });

    // com_ability의 ability_id가 profile과 ability의 식별자로 똑같이 들어가도록 해야한다. (나중에 아이템 연계시 그게 편함)

    console.log(produceProfiles);

    this.repProfile.remove(produceProfiles);
    console.log('프로듀스 프로필 삭제');

    profiles = await this.dataSource.query(
      `
    SELECT a.ability_id AS id
        , a.project_id 
        , a.speaker 
        , a.profile_height 
        , a.profile_age 
        , a.profile_birth_date 
        , 1 is_main
        , 1 use_standing
        , 1 use_emoticon
        , a.profile_favorite_id profile_favorite_id
        , a.profile_hate_id profile_dislike
        , a.profile_line_id profile_introduce
        , a.profile_introduce_id profile_etc
    FROM pier.com_ability a
    WHERE a.project_id = ?;    
    `,
      [project_id],
    );

    // * 각각의 구버전 profile에 맞는 데이터 생성
    for (const profile of profiles) {
      // profile_lang 데이터 생성
      const favoriteText = await this.repTextLocalize.findOneBy({
        text_id: profile.profile_favorite,
      });
      const dislikeText = await this.repTextLocalize.findOneBy({
        text_id: profile.profile_dislike,
      });
      const introText = await this.repTextLocalize.findOneBy({
        text_id: profile.profile_introduce,
      });
      const etcText = await this.repTextLocalize.findOneBy({
        text_id: profile.profile_etc,
      });

      profile.localizations = [];

      if (favoriteText) {
        profile.localizations.push(
          this.repProfileLang.create({
            lang: 'KO',
            profile_text: favoriteText.KO,
            text_type: 'favorite',
          }),
        );
      }

      if (dislikeText) {
        profile.localizations.push(
          this.repProfileLang.create({
            lang: 'KO',
            profile_text: dislikeText.KO,
            text_type: 'dislike',
          }),
        );
      }

      if (introText) {
        profile.localizations.push(
          this.repProfileLang.create({
            lang: 'KO',
            profile_text: introText.KO,
            text_type: 'introduce',
          }),
        );
      }

      if (etcText) {
        profile.localizations.push(
          this.repProfileLang.create({
            lang: 'KO',
            profile_text: etcText.KO,
            text_type: 'etc',
          }),
        );
      }

      // 프로필 라인 가져오기
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

      for (const line of profile.lines) {
        line.localizations = [];
        const line_text = await this.repTextLocalize.findOneBy({
          text_id: line.text_id,
        });

        if (line_text) {
          line.localizations.push(
            this.repProfileLineLang.create({
              lang: 'KO',
              line_text: line_text.KO,
            }),
          );
        }
      } // ? end of profile line localizations

      profile.abilities = await this.dataSource.query(
        `
      SELECT a.ability_id 
          , a.ability_name 
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

      for (const ability of profile.abilities) {
        ability.localizations = [];
        const ability_text = await this.repTextLocalize.findOneBy({
          text_id: ability.local_id,
        });

        if (ability_text) {
          ability.localizations.push(
            this.repAbilityLang.create({
              lang: 'KO',
              ability_name: ability_text.KO,
            }),
          );
        }
      }
    } // ? end of top for

    // * nametag 삭제하고 복사하기
    console.log('프로듀스 네임태그를 삭제!');
    await this.repNametag.delete({ project_id });
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

    console.log('프로듀스 네임태그에 입력시작');
    await this.repNametag.save(originNametags);

    try {
      console.log('프로필 저장 시작');
      await this.repProfile.save(profiles);
    } catch (error) {
      return { isSuccess: false, error };
    }

    console.log('프로필 저장 끝');
    return { isSuccess: true, total: profiles.length };
  } // ? END OF copyProfile

  /////////////////////////////////////

  // list_model, slave, motion 가져오기
  async copyModels(project_id: number) {
    let result: Model[];

    // 현 프로듀스의 model 정보를 삭제한다.
    await this.repModel.delete({ project_id });

    // 구 DB에서 데이터 가져오기
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
    try {
      const produceList = await this.repLiveResource.find({
        where: { project_id, live_type: 'live_illust' },
      });
      await this.repLiveResource.remove(produceList);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '프로듀스 라이브 삭제 실패',
        HttpStatus.BAD_REQUEST,
      );
    }

    let result: LiveResource[];

    // 두 테이블이 합쳐지는거라서 origin_id를 따오고, id는 신규로 부여
    result = await this.dataSource.query(`
    SELECT a.live_illust_id as origin_id
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
    WHERE a.live_illust_id = ${model.origin_id};
      `);

      model.details = details;

      console.log(`live details : `, model.details.length);

      model.localizations = await this.dataSource.query(`
      SELECT 'live_illust' resource_type
        , lang 
        , ifnull(public_name, '-') public_name
        , ifnull(summary, '-') summary
      FROM pier.list_illust_lang a
    WHERE a.illust_id = ${model.origin_id} AND a.illust_type = 'live2d';
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
    try {
      const produceList = await this.repLiveResource.find({
        where: { project_id, live_type: 'live_object' },
      });
      await this.repLiveResource.remove(produceList);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '프로듀스 라이브 삭제 실패',
        HttpStatus.BAD_REQUEST,
      );
    }

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

  // * 프로필 대사 다국어 데이터 생성
  async createProfileLineLang(profile_id: number) {
    // 프로필 ID 에 해당하는 line 정보 가져오기
    const lines: ProfileLine[] = await this.dataSource.query(`
    SELECT a.* 
      FROM produce.profile_line a
    WHERE a.profile_id = ${profile_id};
    `);

    console.log(lines);

    for (const line of lines) {
      // 지우고 시작
      await this.dataSource.query(`
      DELETE FROM produce.profile_line_lang WHERE line_id = ${line.id};
      `);

      const textLocalize = await this.repTextLocalize.findOneBy({
        text_id: line.text_id,
      });

      line.localizations = [];

      if (!textLocalize) continue;

      line.localizations.push(
        this.repProfileLineLang.create({
          line_text: textLocalize.KO,
          lang: 'KO',
        }),
      );
      line.localizations.push(
        this.repProfileLineLang.create({
          line_text: textLocalize.EN,
          lang: 'EN',
        }),
      );
      line.localizations.push(
        this.repProfileLineLang.create({
          line_text: textLocalize.JA,
          lang: 'JA',
        }),
      );
    }

    try {
      await this.repProfileLine.save(lines);
      return { isSuccess: true, totalLines: lines.length };
    } catch (error) {
      return { isSuccess: false, error };
    }
  }

  //
  getDefaultExtension() {
    return this.repPublicExtension.create({
      thumbnail_url: null,
      thumbnail_key: null,
      bucket: null,
    });
  }

  // Default Image Localization 생성
  getDefaultLocalization(
    item: StoryStaticImage,
    default_lang: string,
  ): ImageLocalization {
    return this.repImageLocalization.create({
      lang: default_lang,
      public_name: item.image_name,
      summary: '',
    });
  }

  // * 올드 데이터 카피, 컨버팅 (마이그레이션으로 이동 필요)
  async copyOriginStaticImageResource(project_id: number, type: string) {
    console.log(`copyOriginStaticImageResource START ${project_id} / ${type}`);

    let result: StoryStaticImage[];
    const updateItems: StoryStaticImage[] = [];

    console.log('프로듀스에 저장된 이미지 삭제 시작');
    const produceStaticImages: StoryStaticImage[] =
      await this.repStoryStaticImage.find({
        where: { project_id, image_type: type },
      });
    await this.repStoryStaticImage.remove(produceStaticImages);
    console.log('프로듀스에 저장된 이미지 삭제 종료');

    if (type == RESOURCE_BG)
      result = await this.dataSource.query(OLD_Q_COPY_LIST_BG, [project_id]);
    else if (type == RESOURCE_MINICUT)
      result = await this.dataSource.query(OLD_Q_COPY_LIST_MINICUT, [
        project_id,
      ]);
    else if (type == RESOURCE_ILLUST)
      result = await this.dataSource.query(OLD_Q_COPY_LIST_ILLUST, [
        project_id,
      ]);
    else {
      return { isSuccess: false, error: 'Wrong type' };
    }

    console.log(`result origin data count : `, result.length);

    for (const origin of result) {
      console.log(`in for : `, origin);

      // 공개된 미니컷에 대한 추가 처리
      if (
        origin.is_public &&
        (origin.image_type == RESOURCE_MINICUT ||
          origin.image_type == RESOURCE_ILLUST)
      ) {
        console.log(`is public !!!!!!!!!!!!!!!!!`);

        let Q_LANG = ``;
        let Q_THUMB = ``;

        if (origin.image_type == RESOURCE_MINICUT) {
          Q_LANG = OLD_Q_COPY_LIST_MINICUT_LANG;
          Q_THUMB = OLD_Q_COPY_LIST_MINICUT_THUMBNAIL;
        } else if (origin.image_type == RESOURCE_ILLUST) {
          Q_LANG = OLD_Q_COPY_LIST_ILLUST_LANG;
          Q_THUMB = OLD_Q_COPY_LIST_ILLUST_THUMBNAIL;
        }

        // localizations
        origin.localizations = await this.dataSource.query(Q_LANG, [
          origin.id,
          origin.image_type,
        ]);

        const extensions = await this.dataSource.query(Q_THUMB, [origin.id]);

        origin.extension = extensions[0];
      } else {
        origin.extension = this.getDefaultExtension();
        origin.localizations = [];
        origin.localizations.push(this.getDefaultLocalization(origin, 'KO'));
      }

      updateItems.push(origin);
    }

    // result.forEach((origin) => {
    //   // const item: StoryStaticImage = this.repStaticImage.create(origin);
    //   // const item = items[0];

    //   // console.log(`origin check : `, item);
    //   origin.extension = this.getDefaultExtension();
    //   origin.localizations = [];
    //   origin.localizations.push(this.getDefaultLocalization(origin, 'KO'));
    // });

    try {
      console.log('Start... Insert static image');

      await this.repStoryStaticImage.save(updateItems);
    } catch (error) {
      if (
        error.driverError &&
        error.driverError.code &&
        error.driverError.sqlMessage
      ) {
        return { isSuccess: false, error: error.driverError.sqlMessage };
      } else return { isSuccess: false, error };
    }

    // console.log(result);
    return { isSuccess: true, total: result.length };
  } // ? END copy.
} // ? End of class
