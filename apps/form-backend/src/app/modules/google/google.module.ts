import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from '../company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Companies])],
  providers: [GoogleService],
  controllers: [GoogleController],
})
export class GoogleModule {}
