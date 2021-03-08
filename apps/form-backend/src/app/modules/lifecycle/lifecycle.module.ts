import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifecycleController } from './lifecycle.controller';
import { LifecycleService } from './lifecycle.service';
import { Lifecycles } from './lifecycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lifecycles])],
  controllers: [LifecycleController],
  providers: [LifecycleService]
})
export class LifecycleModule {}
