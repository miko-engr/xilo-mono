import { Test, TestingModule } from '@nestjs/testing';
import { RicochetController } from './ricochet.controller';
import { RicochetService } from './ricochet.service';
class mockRicochetService {}
describe('Ricochet Controller', () => {
  let controller: RicochetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RicochetController],
      providers: [
        {
          provide: RicochetService,
          useClass: mockRicochetService,
        },
      ],
    }).compile();

    controller = module.get<RicochetController>(RicochetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
