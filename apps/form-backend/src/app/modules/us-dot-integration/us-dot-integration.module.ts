import { Module } from '@nestjs/common';
import { UsDotIntegrationService } from './us-dot-integration.service';

@Module({
  providers: [UsDotIntegrationService],
  exports: [UsDotIntegrationService],
})
export class UsDotIntegrationModule {}
