import { Module } from '@nestjs/common';
import { DocuSignController } from './docu-sign.controller';
import { DocuSignService } from './docu-sign.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/user.entity';
import { Companies } from '../company/company.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Users, Companies])],
  controllers: [DocuSignController],
  providers: [DocuSignService],
})
export class DocuSignModule {}
