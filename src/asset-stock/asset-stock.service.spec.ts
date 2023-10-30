import { Test, TestingModule } from '@nestjs/testing';
import { AssetStockService } from './asset-stock.service';

describe('AssetStockService', () => {
  let service: AssetStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetStockService],
    }).compile();

    service = module.get<AssetStockService>(AssetStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
