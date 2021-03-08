import { Module } from '@nestjs/common';
import { PartnerXeService } from './partner-xe.service';
import { PartnerXeController } from './partner-xe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Clients])],
  providers: [PartnerXeService],
  controllers: [PartnerXeController],
})
export class PartnerXeModule {}
