import { Module, Global } from '@nestjs/common';
import { V2EzlynxService } from './v2-ezlynx.service';
import { V2EzlynxHelper } from './helper/v2-ezlynx.helper';
import { Clients } from '../client/client.entity';
import { Homes } from '../home/homes.entity';
import { Answers } from '../../entities/Answers';
import { Integrations } from '../integration/Integrations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EzlynxValidate } from './helper/ezlynx.validate';
import { IntegrationValidator } from "./helper/integration-validator"
import { EzlynxModule } from '../ezlynx/ezlynx.module';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Clients, Homes, Answers, Integrations]),
    EzlynxModule
  ],

  providers: [V2EzlynxService, V2EzlynxHelper, EzlynxValidate, IntegrationValidator],
  exports: [V2EzlynxService, V2EzlynxHelper, EzlynxValidate, IntegrationValidator],
})
export class V2EzlynxModule { }
