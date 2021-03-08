import { Test, TestingModule } from '@nestjs/testing';
import { TextCallbackController } from './text-callback.controller';
import { TextCallbackService } from './text-callback.service';

class MockTextCallbackService {}
describe('TextCallback Controller', () => {
  let controller: TextCallbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextCallbackController],
      providers: [
        {
          provide: TextCallbackService,
          useClass: MockTextCallbackService
        }
      ]
    }).compile();

    controller = await module.resolve<TextCallbackController>(
      TextCallbackController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
