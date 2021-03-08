import { Module } from '@nestjs/common';
import { ZillowService } from './zillow.service';
import { ZillowController } from './zillow.controller';

@Module({
  providers: [ZillowService],
  controllers: [ZillowController]
})
export class ZillowModule {}
