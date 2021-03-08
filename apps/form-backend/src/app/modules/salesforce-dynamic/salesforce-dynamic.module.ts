import { Module } from '@nestjs/common';
import { SalesforceDynamicService } from './salesforce-dynamic.service';
import { SalesforceDynamicController } from './salesforce-dynamic.controller';

@Module({
  providers: [SalesforceDynamicService],
  controllers: [SalesforceDynamicController]
})
export class SalesforceDynamicModule {}
