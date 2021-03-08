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
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create.form.dto';
import { AuthGuard } from '../../guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get('company/v2')
  listByCompany() {
    return this.formService.listByCompany();
  }

  @Get('company/form-only')
  listFormOnlyByCompany() {
    return this.formService.listFormOnlyByCompany();
  }
  @Get('dashboard/:id')
  listById(@Param('id') id: number) {
    return this.formService.listById(id);
  }
  @Get('company/all')
  listByCompanyForUser() {
    return this.formService.listByCompanyForUser();
  }
  @Get('templates/all')
  listAllTemplates() {
    return this.formService.listAllTemplates();
  }
  @Get(':id')
  listOne(@Param('id') id: number) {
    return this.formService.listOne(id);
  }
  @Patch('bulk/update')
  bulkUpdate() {
    return this.formService.bulkUpdate();
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() formBody: CreateFormDto) {
    return this.formService.update(id, formBody);
  }
  @Post('')
  create(@Body() formBody: CreateFormDto) {
    return this.formService.create(formBody);
  }
  // @Post('default')
  // createDefaults(@Body() formBody:CreateFormDto){
  //     return this.formService.createDefaults(formBody)
  // }
  @Post('duplicate')
  duplicate(@Body() formBody: CreateFormDto) {
    return this.formService.duplicate(formBody);
  }
  // @Post('default/v1/home')
  // createV1HomeForm(@Body() formBody:CreateFormDto){
  //     return this.formService.createV1HomeForm(formBody)
  // }

  @Post('default/v2/csv')
  createFormFromCSV(@Body() csv: any) {
    return this.formService.createFormFromCSV(csv);
  }
  @Post('default/progressive')
  createProgressiveAutoForm() {
    return this.formService.createProgressiveAutoForm();
  }
  @Post('default/ezlynx/auto')
  createEZLynxAutoForm() {
    return this.formService.createEZLynxAutoForm();
  }
  @Post('default/v2/auto-home')
  createV2AutoHomeForm() {
    return this.formService.createV2AutoHomeForm();
  }
  @Post('default/ezlynx/home')
  createEZLynxHomeForm() {
    return this.formService.createEZLynxHomeForm();
  }

  @Post('default/ezlynx/simple/auto')
  createEZLynxSimpleAutoForm() {
    return this.formService.createEZLynxSimpleAutoForm();
  }

  @Post('default/ezlynx/simple/home')
  createEZLynxSimpleHomeForm() {
    return this.formService.createEZLynxSimpleHomeForm();
  }

  @Post('default/v2/simple/auto-home')
  createV2SimpleAutoHomeForm() {
    return this.formService.createV2SimpleAutoHomeForm();
  }

  @Post('default/ezlynx/trucking')
  createCommercialTruckingForm() {
    return this.formService.createCommercialTruckingForm();
  }

  @Post('default/ezlynx/simple/trucking')
  createSimpleCommercialTruckingForm() {
    return this.formService.createSimpleCommercialTruckingForm();
  }
  @Post('default/cse/ca')
  createCSECAForm() {
    return this.formService.createCSECAForm();
  }

  @Post('default/insurance')
  createInsuranceForm() {
    return this.formService.createInsuranceForm();
  }
  @Post('update/start-pages')
  updateStartPages() {
    return this.formService.updateStartPages();
  }

  // @Post('default-home')
  // createHomeDefaults(){
  //     return this.formService.createHomeDefaults()
  // }

  @Delete(':id')
  deleteForm(@Param('id') id: number) {
    return this.formService.deleteForm(id);
  }
  @Get('company/default')
  listDefaultForms() {
    return this.formService.listDefaultForms();
  }
  @Post('duplicateForm')
  duplicateForm() {
    return this.formService.duplicateForm();
  }
}
