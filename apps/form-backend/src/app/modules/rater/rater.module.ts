import { Module } from '@nestjs/common';
import { RaterController } from './rater.controller';
import { RaterService } from './rater.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/user.entity';
import { Forms } from '../form/forms.entity';
import { Raters } from './raters.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Users, Forms, Raters])],
  controllers: [RaterController],
  providers: [RaterService],
})
export class RaterModule {}
