import { Module } from '@nestjs/common';
import { V2IntegrationService } from './v2-integration.service';
import { V2IntegrationController } from './v2-integration.controller';
import { IntegrationModule } from '../integration/integration.module';
@Module({
  imports: [IntegrationModule],
  providers: [V2IntegrationService],
  controllers: [V2IntegrationController],
})
export class V2IntegrationModule {}
