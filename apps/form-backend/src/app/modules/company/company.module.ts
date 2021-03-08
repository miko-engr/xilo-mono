import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from './company.entity';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { Agents } from '../agent/agent.entity';
import { Forms } from '../form/forms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Companies, Lifecycles, Agents, Forms])],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
