import { Test, TestingModule } from '@nestjs/testing';
import { NowCertsController } from './now-certs.controller';
import { NowCertsService } from './now-certs.service';
class MockNowCertsService {}
describe('NowCerts Controller', () => {
  let controller: NowCertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NowCertsController],
      providers: [
        {
          provide: NowCertsService,
          useClass: MockNowCertsService,
        },
      ],
    }).compile();

    controller = await module.resolve<NowCertsController>(NowCertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
