import { Test, TestingModule } from '@nestjs/testing';
import { QuoteRushController } from './quote-rush.controller';
import { QuoteRushService } from './quote-rush.service';
class mockQuoteRushService {}
describe('QuoteRush Controller', () => {
  let controller: QuoteRushController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuoteRushController],
      providers: [
        {
          provide: QuoteRushService,
          useClass: mockQuoteRushService,
        },
      ],
    }).compile();

    controller = await module.resolve<QuoteRushController>(QuoteRushController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
