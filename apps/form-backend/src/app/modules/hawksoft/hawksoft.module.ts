import { Module } from '@nestjs/common';
import { HawksoftController } from './hawksoft.controller';
import { HawksoftService } from './hawksoft.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients])],
  controllers: [HawksoftController],
  providers: [HawksoftService],
})
export class HawksoftModule {}
