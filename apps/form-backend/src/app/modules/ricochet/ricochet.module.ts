import { Module } from '@nestjs/common';
import { RicochetService } from './ricochet.service';
import { RicochetController } from './ricochet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients])],
  providers: [RicochetService],
  controllers: [RicochetController],
})
export class RicochetModule {}
