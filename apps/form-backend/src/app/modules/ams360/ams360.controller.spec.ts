import { Test, TestingModule } from '@nestjs/testing';
import { Ams360Controller } from './ams360.controller';
import { Ams360Service } from './ams360.service';
class mockAms360Service {}
describe('Ams360 Controller', () => {
  let controller: Ams360Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Ams360Controller],
      providers: [
        {
          provide: Ams360Service,
          useClass: mockAms360Service,
        },
      ],
    }).compile();

    controller = await module.resolve<Ams360Controller>(Ams360Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
