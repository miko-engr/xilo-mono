import { Controller, Post, Body, Patch, Get, Param } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTasksDto } from './dto/create-tasks.dto';
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Post('create')
  create(@Body() bodyObj: CreateTasksDto) {
    return this.taskService.create(bodyObj);
  }
  @Patch('upsert')
  upsert(@Body() bodyObj: CreateTasksDto) {
    return this.taskService.upsert(bodyObj);
  }

  @Patch('delete')
  delete(@Body('taskIds') taskIds: number[]) {
    return this.taskService.delete(taskIds);
  }
  @Get('company')
  listByCompany() {
    return this.taskService.listByCompany();
  }
  @Get('agent')
  listByAgent() {
    return this.taskService.listByAgent();
  }
  @Get('id/:id')
  listOneById(@Param('id') id: number) {
    return this.taskService.listOneById(id);
  }
  @Get('agent/tables')
  listByAgentTable() {
    return this.taskService.listByAgentTable();
  }
}
