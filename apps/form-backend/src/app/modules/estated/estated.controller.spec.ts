import { Test, TestingModule } from '@nestjs/testing';
import { EstatedController } from './estated.controller';
import { EstatedService } from './estated.service';
class mockEstatedService {}
describe('Estated Controller', () => {
  let controller: EstatedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstatedController],
      providers: [
        {
          provide: EstatedService,
          useClass: mockEstatedService,
        },
      ],
    }).compile();

    controller = await module.resolve<EstatedController>(EstatedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
