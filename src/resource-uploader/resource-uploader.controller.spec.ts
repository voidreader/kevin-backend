import { Test, TestingModule } from '@nestjs/testing';
import { ResourceUploaderController } from './resource-uploader.controller';

describe('ResourceUploaderController', () => {
  let controller: ResourceUploaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceUploaderController],
    }).compile();

    controller = module.get<ResourceUploaderController>(ResourceUploaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
