import { Test, TestingModule } from '@nestjs/testing';
import { ResourceUploaderService } from './resource-uploader.service';

describe('ResourceUploaderService', () => {
  let service: ResourceUploaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceUploaderService],
    }).compile();

    service = module.get<ResourceUploaderService>(ResourceUploaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
