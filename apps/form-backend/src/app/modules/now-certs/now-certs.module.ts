import { Module } from '@nestjs/common';
import { NowCertsController } from './now-certs.controller';
import { NowCertsService } from './now-certs.service';
import { ClientModule } from '../client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
@Module({
  imports: [ TypeOrmModule.forFeature([
    Clients
  ]),
    ClientModule
  ],
  controllers: [NowCertsController],
  providers: [NowCertsService],
  exports: [NowCertsService]
})
export class NowCertsModule {}
