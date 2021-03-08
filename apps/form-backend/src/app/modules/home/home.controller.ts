import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  Patch,
  Put,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/create-home.dto';
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.homeService.delete(id);
  }
  @Post('client')
  create(@Body() bodyObj: CreateHomeDto) {
    return this.homeService.create(bodyObj);
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() bodyObj: CreateHomeDto) {
    return this.homeService.update(id, bodyObj);
  }
  @Put()
  upsert(@Body() bodyObj: CreateHomeDto) {
    return this.homeService.upsert(bodyObj);
  }
}
