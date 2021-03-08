import { Test, TestingModule } from '@nestjs/testing';
import { CityDistanceController } from './city-distance.controller';
import { CityDistanceService } from './city-distance.service';

class mockCityDistanceService {}

describe('CityDistance Controller', () => {
  let controller: CityDistanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityDistanceController],
      providers: [
        {
          provide: CityDistanceService,
          useClass: mockCityDistanceService,
        },
      ],
    }).compile();
    
    controller = await module.resolve<CityDistanceController>(CityDistanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});