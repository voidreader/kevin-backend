import { Test, TestingModule } from '@nestjs/testing';
import { AssetStockController } from './asset-stock.controller';

describe('AssetStockController', () => {
  let controller: AssetStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetStockController],
    }).compile();

    controller = module.get<AssetStockController>(AssetStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
