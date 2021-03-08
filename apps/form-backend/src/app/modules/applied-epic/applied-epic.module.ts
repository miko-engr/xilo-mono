import { Module } from '@nestjs/common';
import { AppliedEpicService } from './applied-epic.service';
import { AppliedEpicController } from './applied-epic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients])],
  providers: [AppliedEpicService],
  controllers: [AppliedEpicController],
})
export class AppliedEpicModule {}
