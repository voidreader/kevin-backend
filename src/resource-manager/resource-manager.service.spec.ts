import { Test, TestingModule } from '@nestjs/testing';
import { ResourceManagerService } from './resource-manager.service';

describe('ResourceManagerService', () => {
  let service: ResourceManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceManagerService],
    }).compile();

    service = module.get<ResourceManagerService>(ResourceManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
