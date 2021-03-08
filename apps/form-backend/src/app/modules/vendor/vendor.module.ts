import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from '../company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Companies])],
  controllers: [VendorController],
  providers: [VendorService]
})
export class VendorModule {}
