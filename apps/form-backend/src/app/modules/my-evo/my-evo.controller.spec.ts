import { Test, TestingModule } from '@nestjs/testing';
import { MyEvoController } from './my-evo.controller';
import { MyEvoService } from './my-evo.service';
class MockMyEvoService {}
describe('MyEvo Controller', () => {
  let controller: MyEvoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyEvoController],
      providers: [
        {
          provide: MyEvoService,
          useClass: MockMyEvoService,
        },
      ],
    }).compile();

    controller = await module.resolve<MyEvoController>(MyEvoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
