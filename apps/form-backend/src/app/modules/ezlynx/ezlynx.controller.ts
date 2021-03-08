import { Controller, Get, Param } from '@nestjs/common';
import { EzlynxService } from './ezlynx.service';
import { V2EzlynxService } from "../v2-ezlynx/v2-ezlynx.service"
@Controller('ezlynx')
export class EzlynxController {
  constructor(private readonly ezlynxService: EzlynxService, private readonly v2EzlynxService: V2EzlynxService) { }

  @Get('upsert/:type/:clientId')
  createContact(
    @Param('type') type: string,
    @Param('clientId') clientId: number
  ) {
    return this.ezlynxService.createContact(clientId, type);
  }
  @Get('upsert-personal-applicant/:clientId')
  createPersonalApplicant(@Param('clientId') clientId: number) {
    return this.ezlynxService.createPersonalApplicant(clientId);
  }
  @Get('v2/upsert/:type/:clientId')
  createApplicant(@Param('type') type: string, @Param('clientId') clientId: number) {
    return this.v2EzlynxService.createApplicant(clientId, type)
  }
  @Get('v2/field/:type/:field')
  getFields() {
    return this.v2EzlynxService.getFields()
  }
  @Get('v2/set-defaults/:id/:type')
  setDefaults() {
    return this.v2EzlynxService.setDefaults()
  }

}
