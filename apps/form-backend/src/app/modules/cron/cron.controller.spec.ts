import { Test, TestingModule } from '@nestjs/testing';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
class mockCronService {}
describe('Cron Controller', () => {
  let controller: CronController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronController],
      providers: [
        {
          provide: CronService,
          useClass: mockCronService,
        },
      ],
    }).compile();

    controller = await module.resolve<CronController>(CronController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
