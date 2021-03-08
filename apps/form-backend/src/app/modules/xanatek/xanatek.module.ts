import { Module } from '@nestjs/common';
import { XanatekService } from './xanatek.service';
import { XanatekController } from './xanatek.controller';
import { Clients } from '../client/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Clients])],
  providers: [XanatekService],
  controllers: [XanatekController],
})
export class XanatekModule {}
