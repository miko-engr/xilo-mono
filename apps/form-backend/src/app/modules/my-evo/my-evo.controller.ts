import {
  Controller,
  Post,
  Body
} from '@nestjs/common';
import { MyEvoService } from './my-evo.service';
import { MyEvoDto } from './dto/my-evo.dto';

@Controller('my-evo')
export class MyEvoController {
  constructor(private readonly myEvoService: MyEvoService) { }

  @Post('/')
  create(@Body() myEvoDto: MyEvoDto) {
    return this.myEvoService.createFile(myEvoDto);
  }
}
