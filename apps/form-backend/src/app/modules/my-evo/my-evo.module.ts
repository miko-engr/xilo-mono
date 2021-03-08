import { Module } from '@nestjs/common';
import { MyEvoController } from './my-evo.controller';
import { MyEvoService } from './my-evo.service';
import { ClientModule } from '../client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
@Module({
  imports: [ TypeOrmModule.forFeature([
    Clients
  ]),
    ClientModule
  ],
  controllers: [MyEvoController],
  providers: [MyEvoService],
  exports: [MyEvoService]
})
export class MyEvoModule {}
