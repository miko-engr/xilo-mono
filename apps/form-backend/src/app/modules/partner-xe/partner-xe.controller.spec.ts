import { Test, TestingModule } from '@nestjs/testing';
import { PartnerXeController } from './partner-xe.controller';
import { PartnerXeService } from './partner-xe.service';
class mockPartnerXeService {}
describe('PartnerXe Controller', () => {
  let controller: PartnerXeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerXeController],
      providers: [
        {
          provide: PartnerXeService,
          useClass: mockPartnerXeService,
        },
      ],
    }).compile();

    controller = module.get<PartnerXeController>(PartnerXeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
