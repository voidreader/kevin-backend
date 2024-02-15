import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/produce_entity/product.entity';
import { Repository } from 'typeorm';
import { NoticeImageDto, productDto } from './dto/project.dto';
import { winstonLogger } from 'src/util/winston.config';
import { DiscardResource } from 'src/database/produce_entity/discard-resource.entity';
import { ProductLang } from 'src/database/produce_entity/product-lang.entity';
import { Notice } from 'src/database/produce_entity/notice.entity';
import { NoticeDetail } from 'src/database/produce_entity/notice-detail.entity';

@Injectable()
export class ProjectOperationService {
  constructor(
    @InjectRepository(Product)
    private readonly repProduct: Repository<Product>,
    @InjectRepository(ProductLang)
    private readonly repProductLang: Repository<ProductLang>,
    @InjectRepository(Notice)
    private readonly repNotice: Repository<Notice>,
    @InjectRepository(NoticeDetail)
    private readonly repNoticeDetail: Repository<NoticeDetail>,
    @InjectRepository(DiscardResource)
    private readonly repDiscardResource: Repository<DiscardResource>,
  ) {}

  private saveDiscardImage(url: string, key: string) {
    const discardItem = this.repDiscardResource.create();
    discardItem.key = key;
    discardItem.url = url;

    this.repDiscardResource.save(discardItem);
  }

  // 상품 리스트
  async getProductList(project_id: number) {
    const list = await this.repProduct.find({
      where: { project_id },
      order: { product_id: 'ASC' },
    });

    return { isSuccess: true, list };
  }

  // 상품 생성
  async createProduct() {}

  // 상품 정보 수정
  async updateProduct(project_id: number, master_id: number, dto: productDto) {
    const product = this.repProduct.create(dto);

    try {
      await this.repProduct.save(product);
    } catch (error) {
      winstonLogger.error(error);
      new HttpException(error, HttpStatus.BAD_REQUEST);
    }

    return this.getProductList(project_id);
  } // ? END

  // 상품 배너 변경&업로드
  async changeProductBanner(
    project_id: number,
    master_id: number,
    file: Express.MulterS3.File,
    lang: string,
  ) {
    winstonLogger.debug(
      { project_id, master_id, lang, file },
      'changeProductBanner',
    );

    let incomingDiscard: DiscardResource = null;
    if (!file) {
      throw new HttpException(
        '유효하지 않은 파일(Invalid file)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { location, key, bucket } = file;

    const target = await this.repProduct.findOneBy({ master_id });
    let targetLang: ProductLang;

    if (!target) {
      console.log(`상품 마스터 정보 없음!!!`);

      throw new HttpException(
        '대상 상품의 마스터 정보가 존재하지 않음!',
        HttpStatus.BAD_REQUEST,
      );
    }

    target.langs.forEach((item) => {
      if (item.lang == lang) {
        targetLang = item;
      }
    });

    if (!targetLang) {
      throw new HttpException(
        '먼저 언어별 기본정보를 입력 후 업로드해주세요',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 업데이트 파라매터
    const updateParam = {
      banner_url: location,
      banner_key: key,
      bucket,
    };

    try {
      await this.repProductLang.update({ id: targetLang.id }, updateParam);
      this.saveDiscardImage(targetLang.banner_url, targetLang.banner_key);
    } catch (error) {
      this.saveDiscardImage(location, key);
      winstonLogger.error(error);
      new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    return { isSuccess: true, ...updateParam };
  } // ? END changeProductBanner

  // * 공지사항 리스트 조회
  async getNoticeList(project_id: number) {
    const list = await this.repNotice.find({
      where: { project_id },
      order: { sortkey: 'ASC', notice_id: 'DESC' },
    });

    return { isSuccess: true, list };
  }

  // * 공지사항 이미지 변경
  async changeNoticeImage(
    project_id: number,
    notice_id: number,
    dto: NoticeImageDto,
    file: Express.MulterS3.File,
  ) {
    winstonLogger.debug(
      { project_id, notice_id, dto, file },
      'changeNoticeImage',
    );

    let incomingDiscard: DiscardResource = null;
    if (!file) {
      throw new HttpException(
        '유효하지 않은 파일(Invalid file)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { location, key, bucket } = file;

    const target = await this.repNotice.findOneBy({ notice_id });
    if (!target) {
      console.log(`공지사항 정보 정보 없음!!!`);

      throw new HttpException(
        '공지사항 정보가 존재하지 않음!',
        HttpStatus.BAD_REQUEST,
      );
    }

    let targetDetail: NoticeDetail;
    target.details.forEach((item) => {
      if (item.lang == dto.lang) {
        targetDetail = item;
      }
    });

    if (!targetDetail) {
      throw new HttpException(
        '먼저 언어별 기본정보를 입력 후 업로드해주세요',
        HttpStatus.BAD_REQUEST,
      );
    }

    let updateParam = null;
    let discardURL = '';
    let discardKey = '';

    // 타입에 따라 파라매터 분류
    if (dto.type == 'banner') {
      updateParam = {
        banner_url: location,
        banner_key: key,
        banner_bucket: bucket,
      };
      discardURL = targetDetail.banner_url;
      discardKey = targetDetail.banner_key;
    } else {
      updateParam = {
        detail_url: location,
        detail_key: key,
        detail_bucket: bucket,
      };
      discardURL = targetDetail.detail_url;
      discardKey = targetDetail.detail_key;
    }

    try {
      await this.repNoticeDetail.update({ id: targetDetail.id }, updateParam);
      this.saveDiscardImage(discardURL, discardKey);

      console.log(`update done!`);
    } catch (error) {
      this.saveDiscardImage(location, key);
      winstonLogger.error(error);
      new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    return { isSuccess: true, ...updateParam };
  } // ? END  changeNoticeImage
}
