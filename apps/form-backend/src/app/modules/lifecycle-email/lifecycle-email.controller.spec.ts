import { Test, TestingModule } from '@nestjs/testing';
import { LifecycleEmailController } from './lifecycle-email.controller';
import { LifecycleEmailService } from './lifecycle-email.service';
import { EmailService } from '../email/email.service';
import { PdfService } from '../pdf/pdf.service';

class MockPdfService {}
class mockEmailService {}
class mockLifecycleEmailService {}
describe('LifecycleEmail Controller', () => {
  let controller: LifecycleEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifecycleEmailController],
      providers: [
        {
          provide: LifecycleEmailService,
          useClass: mockLifecycleEmailService,
        },
        {
          provide: EmailService,
          useClass: mockEmailService,
        },
        {
          provide: PdfService,
          useClass: MockPdfService,
        },
      ],
    }).compile();

    controller = await module.resolve<LifecycleEmailController>(
      LifecycleEmailController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
