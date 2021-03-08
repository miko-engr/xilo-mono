import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from '../company/company.entity';
import { Pages } from '../page/page.entity';
import { Questions } from '../../entities/Questions'; //TODO should be imported from Questions module
import { Answers } from '../../entities/Answers'; //TODO should be imported from Answers module
import { Integrations } from '../integration/Integrations.entity';
import { Forms } from './forms.entity';
import { DynamicRaters } from '../dynamic-rater/dynamic-raters.entity';
import { DynamicRates } from '../dynamic-rate/dynamic-rates.entity';
import { DynamicCoverages } from '../dynamic-coverage/dynamic-coverages.entity';
import { FormTemplateHelper } from './helper/form-template.helper';
import { V2EzlynxModule } from "../v2-ezlynx/v2-ezlynx.module"
@Module({
  imports: [
    V2EzlynxModule,
    TypeOrmModule.forFeature([
      Companies,
      Pages,
      Questions,
      Answers,
      Integrations,
      Forms,
      DynamicRaters,
      DynamicRates,
      DynamicCoverages,
    ]),
  ],
  controllers: [FormController],
  providers: [FormService, FormTemplateHelper],
  exports: [FormService, FormTemplateHelper],
})
export class FormModule { }
