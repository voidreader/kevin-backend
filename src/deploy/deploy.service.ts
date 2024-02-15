import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/database/produce_entity/coupon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeployService {
  constructor(
    @InjectRepository(Coupon, 'live-produce')
    private readonly liveRepCoupon: Repository<Coupon>,
    @InjectRepository(Coupon)
    private readonly devRepCoupon: Repository<Coupon>,
  ) {}
}
