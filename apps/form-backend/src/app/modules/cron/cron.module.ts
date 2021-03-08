import { Module } from '@nestjs/common';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import { Clients } from '../client/client.entity';
import { Companies } from '../company/company.entity';
import { Crons } from './crons.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Companies, Clients, Crons])],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule {}
