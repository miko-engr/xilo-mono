import { Test, TestingModule } from '@nestjs/testing';
import { V2EzlynxService } from './v2-ezlynx.service';
class mockV2EzlynxService {}
describe('V2EzlynxService', () => {
  let service: V2EzlynxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: V2EzlynxService,
          useClass: mockV2EzlynxService,
        },
      ],
    }).compile();

    service = module.get<V2EzlynxService>(V2EzlynxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
