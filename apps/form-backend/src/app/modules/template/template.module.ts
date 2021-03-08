import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { Templates } from './template.entity';
@Module({
  imports: [ TypeOrmModule.forFeature([ Templates ]) ],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
