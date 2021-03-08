import { Test, TestingModule } from '@nestjs/testing';
import { SalesforceDynamicController } from './salesforce-dynamic.controller';
import { SalesforceDynamicService } from './salesforce-dynamic.service';
class mockSalesforceDynamicService {}
describe('SalesforceDynamic Controller', () => {
  let controller: SalesforceDynamicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesforceDynamicController],
      providers: [
        {
          provide: SalesforceDynamicService,
          useClass: mockSalesforceDynamicService,
        },
      ],
    }).compile();

    controller = module.get<SalesforceDynamicController>(
      SalesforceDynamicController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
