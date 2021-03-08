import { Controller, Post, Body } from '@nestjs/common';
import { EstatedService } from './estated.service';
@Controller('estated')
export class EstatedController {
  constructor(private readonly estatedService: EstatedService) {}
  @Post('getPropertyData')
  getPropertyData(@Body() bodyData: any) {
    return this.estatedService.getPropertyData(bodyData);
  }
}
