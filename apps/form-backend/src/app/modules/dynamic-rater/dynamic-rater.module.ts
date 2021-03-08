import { Module } from '@nestjs/common';
import { DynamicRaterController } from './dynamic-rater.controller';
import { DynamicRaterService } from './dynamic-rater.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/user.entity';
import { Companies } from '../company/company.entity';
import { Forms } from '../form/forms.entity'; // TODO should be imported from Forms module
import { DynamicRaters } from './dynamic-raters.entity';
import { DynamicCoverages } from '../dynamic-coverage/dynamic-coverages.entity';
import { DynamicRates } from '../dynamic-rate/dynamic-rates.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Companies,
      Forms,
      DynamicRaters,
      DynamicCoverages,
      DynamicRates,
    ]),
  ],
  controllers: [DynamicRaterController],
  providers: [DynamicRaterService],
})
export class DynamicRaterModule {}
