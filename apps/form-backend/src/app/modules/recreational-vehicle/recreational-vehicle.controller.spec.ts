import { Test, TestingModule } from '@nestjs/testing';
import { RecreationalVehicleController } from './recreational-vehicle.controller';
import { RecreationalVehicleService } from './recreational-vehicle.service';
class mockRecreationalVehicleService {}
describe('RecreationalVehicle Controller', () => {
  let controller: RecreationalVehicleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecreationalVehicleController],
      providers: [
        {
          provide: RecreationalVehicleService,
          useClass: mockRecreationalVehicleService,
        },
      ],
    }).compile();

    controller = module.get<RecreationalVehicleController>(
      RecreationalVehicleController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
