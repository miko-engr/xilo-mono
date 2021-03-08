import { Module } from '@nestjs/common';
import { AppliedController } from './applied.controller';
import { AppliedService } from './applied.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from './../client/client.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Clients])],
  controllers: [AppliedController],
  providers: [AppliedService],
})
export class AppliedModule {}
