import { Module } from '@nestjs/common';
import { ParameterController } from './parameter.controller';
import { ParameterService } from './parameter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parameters } from './Parameters.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parameters])],
  controllers: [ParameterController],
  providers: [ParameterService]
})
export class ParameterModule {}
