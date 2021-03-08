import { Test, TestingModule } from '@nestjs/testing';
import { AgencyMatrixController } from './agency-matrix.controller';
import { AgencyMatrixService } from './agency-matrix.service';
class mockAgencyMatrixService {}
describe('AgencyMatrix Controller', () => {
  let controller: AgencyMatrixController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyMatrixController],
      providers: [
        {
          provide: AgencyMatrixService,
          useClass: mockAgencyMatrixService,
        },
      ],
    }).compile();

    controller = await module.resolve<AgencyMatrixController>(
      AgencyMatrixController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
