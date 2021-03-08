import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent-dto';
import { Agent } from './interface/agent.interface';
import { AuthGuard } from '../../guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}
  @Get('')
  list() {
    return this.agentService.list();
  }

  @Get('company/agent')
  listByCompanyForAgent() {
    return this.agentService.listByCompanyForAgent();
  }
  @Get('company/user')
  listByCompanyForUser() {
    return this.agentService.listByCompanyForUser();
  }
  @Get('user/list/:id')
  listById(@Param('id') id: number) {
    return this.agentService.listById(id);
  }
  @Get(':id')
  listOne(@Param('id') id: number) {
    return this.agentService.listOne(id);
  }

  @Get('self/list-one')
  listOneByAgent() {
    return this.agentService.listOneByAgent();
  }
  @Get('clients/all')
  listClients() {
    return this.agentService.listClients();
  }
  @Get('user/clients')
  listAllClients() {
    return this.agentService.listAllClients();
  }
  @Get('lifecycles/all')
  listUserForAgent() {
    return this.agentService.listUserForAgent();
  }

  @Post('')
  @UsePipes(new ValidationPipe({ transform: true }))
  signup(@Body() agentBody: CreateAgentDto) {
    return this.agentService.signup(agentBody);
  }
  @Post('update/notifications')
  updateNotification(@Body() agentBody: Agent) {
    return this.agentService.updateNotification(agentBody);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: number, @Body() agentBody: Agent) {
    return this.agentService.update(id, agentBody);
  }
  @Delete('delete/:id')
  deleteAgent(@Param('id') id: number) {
    return this.agentService.deleteAgent(id);
  }
  @Post('update/settings')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateSettings(@Body() settings: object) {
    return this.agentService.updateSettings(settings);
  }
}
