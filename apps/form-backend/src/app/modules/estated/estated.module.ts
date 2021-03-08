import { Module } from '@nestjs/common';
import { EstatedService } from './estated.service';
import { EstatedController } from './estated.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from '../../entities/Answers'; // TODO should be imported from Answers module

@Module({
  imports: [TypeOrmModule.forFeature([Answers])],
  providers: [EstatedService],
  controllers: [EstatedController],
})
export class EstatedModule {}
