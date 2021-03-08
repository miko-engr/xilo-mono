import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Tasks } from './tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Tasks])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
