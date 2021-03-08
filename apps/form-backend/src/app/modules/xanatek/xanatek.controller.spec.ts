import { Test, TestingModule } from '@nestjs/testing';
import { XanatekController } from './xanatek.controller';
import { XanatekService } from './xanatek.service';
class mockXanatekService {}
describe('Xanatek Controller', () => {
  let controller: XanatekController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XanatekController],
      providers: [{ provide: XanatekService, useClass: mockXanatekService }],
    }).compile();

    controller = module.get<XanatekController>(XanatekController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
