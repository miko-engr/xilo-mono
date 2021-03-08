import { Test, TestingModule } from '@nestjs/testing';
import { HawksoftController } from './hawksoft.controller';
import { HawksoftService } from './hawksoft.service';
class mockHawksoftService {}
describe('Hawksoft Controller', () => {
  let controller: HawksoftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HawksoftController],
      providers: [
        {
          provide: HawksoftService,
          useClass: mockHawksoftService,
        },
      ],
    }).compile();

    controller = await module.resolve<HawksoftController>(HawksoftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
