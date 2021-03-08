import { Test, TestingModule } from '@nestjs/testing';
import { DocuSignController } from './docu-sign.controller';
import { DocuSignService } from './docu-sign.service';
class mockDocuSignService {}
describe('DocuSign Controller', () => {
  let controller: DocuSignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocuSignController],
      providers: [
        {
          provide: DocuSignService,
          useClass: mockDocuSignService,
        },
      ],
    }).compile();

    controller = await module.resolve<DocuSignController>(DocuSignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
