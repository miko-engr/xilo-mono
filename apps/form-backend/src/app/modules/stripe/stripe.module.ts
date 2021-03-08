import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { StripeModule as StripeAPIModule } from 'nestjs-stripe';
import { stripe } from '../../constants/appconstant';
import { Companies } from '../company/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    StripeAPIModule.forRoot({
      apiVersion: '2020-03-02',
      apiKey: stripe.stripeSecretKey,
    }),
    TypeOrmModule.forFeature([Companies]),
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
