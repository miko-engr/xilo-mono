import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send-email')
  @UsePipes(new ValidationPipe({ transform: true }))
  sendEmail(@Body() emailBody: CreateEmailDto) {
    return this.emailService.sendEmail(emailBody);
  }

  @Post('add')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() emailBody: CreateEmailDto) {
    return this.emailService.create(emailBody);
  }
  @Patch('edit/:id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: number, @Body() emailBody: CreateEmailDto) {
    return this.emailService.update(id, emailBody);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: number) {
    return this.emailService.delete(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  listByCompany() {
    return this.emailService.listByCompany();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  listOneById(@Param('id') id: number) {
    return this.emailService.listOneById(id);
  }
}
