import { Module } from '@nestjs/common';
import { PlRaterService } from './pl-rater.service';
import { PlRaterController } from './pl-rater.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
import { Integrations } from '../integration/Integrations.entity';
import { Answers } from '../../entities/Answers';
import { PlRaterHelper } from './helper/pl-rater.helper';
@Module({
  imports: [TypeOrmModule.forFeature([Clients, Integrations, Answers])],
  providers: [PlRaterService, PlRaterHelper],
  controllers: [PlRaterController],
})
export class PlRaterModule {}
