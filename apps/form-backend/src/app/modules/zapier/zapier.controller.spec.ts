import { Test, TestingModule } from '@nestjs/testing';
import { ZapierController } from './zapier.controller';
import { ZapierService } from './zapier.service';
class mockZapierService {}
describe('Zapier Controller', () => {
  let controller: ZapierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZapierController],
      providers: [
        {
          provide: ZapierService,
          useClass: mockZapierService,
        },
      ],
    }).compile();

    controller = await module.resolve<ZapierController>(ZapierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
