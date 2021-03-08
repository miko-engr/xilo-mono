import { Test, TestingModule } from '@nestjs/testing';
import { TextMessagesController } from './text-messages.controller';
import { TextMessagesService } from './text-messages.service';

class MockTextMessagesService {}
describe('TextMessages Controller', () => {
  let controller: TextMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextMessagesController],
      providers: [
        {
          provide: TextMessagesService,
          useClass: MockTextMessagesService,
        }
      ]
    }).compile();

    controller = module.get<TextMessagesController>(TextMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
