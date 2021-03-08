import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RaterService } from './rater.service';
import { CreateRaterDto } from './dto/create-rater.dto';
import { AuthGuard } from "../../guards/auth.guard"
@Controller('rater')
export class RaterController {
  constructor(private readonly raterService: RaterService) { }
  @Get()
  @UseGuards(AuthGuard)
  list() {
    return this.raterService.list();
  }
  @Get('company')
  @UseGuards(AuthGuard)
  listByCompany() {
    return this.raterService.listByCompany();
  }
  @Get('company/:id')
  @UseGuards(AuthGuard)
  listByCompanyAndForm(@Param('id') id: number) {
    return this.raterService.listByCompanyAndForm(id);
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  listOne(@Param('id') id: number) {
    return this.raterService.listOne(id);
  }
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: number, @Body() raterBody: CreateRaterDto) {
    return this.raterService.update(id, raterBody);
  }
  @Post()
  create(@Body() raterBody: CreateRaterDto) {
    return this.raterService.create(raterBody);
  }
  @Post('duplicate')
  duplicate(@Body() raterBody: CreateRaterDto) {
    return this.raterService.duplicate(raterBody);
  }
  @Post('template')
  createByTemplate(@Body() raterBody: CreateRaterDto) {
    return this.raterService.createByTemplate(raterBody);
  }
  @Post('default')
  @UseGuards(AuthGuard)
  createByDefault() {
    return this.raterService.createByDefault();
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteRater(@Param('id') id: number) {
    return this.raterService.deleteRater(id);
  }
}
