import { Module, Global } from '@nestjs/common';
import { EzlynxService } from './ezlynx.service';
import { EzlynxController } from './ezlynx.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
import { Homes } from '../home/homes.entity';
import { Forms } from '../form/forms.entity';
import { Companies } from '../company/company.entity';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Clients, Homes, Forms, Companies])],
  providers: [EzlynxService],
  controllers: [EzlynxController],
  exports: [EzlynxService],
})
export class EzlynxModule { }
