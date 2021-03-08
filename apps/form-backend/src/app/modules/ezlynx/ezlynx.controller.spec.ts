import { Test, TestingModule } from '@nestjs/testing';
import { EzlynxController } from './ezlynx.controller';
import { EzlynxService } from './ezlynx.service';
import { V2EzlynxService } from '../v2-ezlynx/v2-ezlynx.service';

class mockEzlynxService {}
class mockV2EzlynxService {}
describe('Ezlynx Controller', () => {
  let controller: EzlynxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EzlynxController],
      providers: [
        {
          provide: EzlynxService,
          useClass: mockEzlynxService,
        },
        {
          provide: V2EzlynxService,
          useClass: mockV2EzlynxService,
        },
      ],
    }).compile();

    controller = await module.resolve<EzlynxController>(EzlynxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
