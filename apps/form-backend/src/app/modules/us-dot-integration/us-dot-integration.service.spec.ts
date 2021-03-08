import { Test, TestingModule } from '@nestjs/testing';
import { UsDotIntegrationService } from './us-dot-integration.service';

describe('UsDotIntegrationService', () => {
  let service: UsDotIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsDotIntegrationService],
    }).compile();

    service = module.get<UsDotIntegrationService>(UsDotIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
