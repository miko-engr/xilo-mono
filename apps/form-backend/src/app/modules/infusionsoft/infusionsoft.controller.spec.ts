import { Test, TestingModule } from '@nestjs/testing';
import { InfusionsoftController } from './infusionsoft.controller';
import { InfusionsoftService } from './infusionsoft.service';
class mockInfusionsoftService {}
describe('Infusionsoft Controller', () => {
  let controller: InfusionsoftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfusionsoftController],
      providers: [
        {
          provide: InfusionsoftService,
          useClass: mockInfusionsoftService,
        },
      ],
    }).compile();

    controller = await module.resolve<InfusionsoftController>(
      InfusionsoftController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
