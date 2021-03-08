import { Module } from '@nestjs/common';
import { DynamicParameterService } from './dynamic-parameter.service';
import { DynamicParameterController } from './dynamic-parameter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicParameters } from './dynamic-parameters.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DynamicParameters])],
  providers: [DynamicParameterService],
  controllers: [DynamicParameterController],
})
export class DynamicParameterModule {}
