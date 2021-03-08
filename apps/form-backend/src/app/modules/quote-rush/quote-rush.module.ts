import { Module } from '@nestjs/common';
import { QuoteRushService } from './quote-rush.service';
import { QuoteRushController } from './quote-rush.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients])],
  providers: [QuoteRushService],
  controllers: [QuoteRushController],
  exports: [QuoteRushService],
})
export class QuoteRushModule {}
