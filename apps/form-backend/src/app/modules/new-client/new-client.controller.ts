import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Put,
  Delete,
} from '@nestjs/common';
import { BusinessService } from '../business/business.service';
import { LocationService } from '../location/location.service';
import { IncidentService } from '../incident/incident.service';
import { RecreationalVehicleService } from '../recreational-vehicle/recreational-vehicle.service';
import { AgentService } from '../agent/agent.service';
import { ClientService } from '../client/client.service';
import { DriverService } from '../driver/driver.service';
import { HomeService } from '../home/home.service';
import { FormService } from '../form/form.service';
import { DynamicRateService } from '../dynamic-rate/dynamic-rate.service';
import { DynamicCoverageService } from '../dynamic-coverage/dynamic-coverage.service';
import { PageService } from '../page/page.service';
import { PdfService } from '../pdf/pdf.service';
import { CompanyService } from '../company/company.service';
import { EzlynxService } from '../ezlynx/ezlynx.service';
import { ClientDto } from '../client/dto/client.dto';
import { CreateDriverDto } from '../driver/dto/create-driver.dto';
import { CreateHomeDto } from '../home/dto/create-home.dto';
import { CreateBusinessDto } from '../business/dto/create-business.dto';
import { LocationDto } from '../location/dto/location.dto';
import { CreateIncidentDto } from '../incident/dto/create-incident.dto';
import { CreateRecreationalVehicleDto } from '../recreational-vehicle/dto/create-recreational-vehicles.dto';
import { UsDotIntegrationService } from '../us-dot-integration/us-dot-integration.service';
// const vehicleController = require('../controllers').vehicles; TODO missing vehicle module
// const commercialController = require('../controllers').commercials; TODO missing commercial module
// const startPageController = require('../controllers').startPages; TODO missing startPage module
// const discountController = require('../controllers').discounts; TODO missing discount module
// const questionController = require('../controllers').questions; TODO missing question module
// const answerController = require('../controllers').answers; TODO missing answer module
@Controller('new-client')
export class NewClientController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly locationService: LocationService,
    private readonly incidentService: IncidentService,
    private readonly recreationalVehicleService: RecreationalVehicleService,
    private readonly agentService: AgentService,
    private readonly clientService: ClientService,
    private readonly driverService: DriverService,
    private readonly homeService: HomeService,
    private readonly formService: FormService,
    private readonly dynamicRateService: DynamicRateService,
    private readonly pageService: PageService,
    private readonly pdfService: PdfService,
    private readonly companyService: CompanyService,
    private readonly ezlynxService: EzlynxService,
    private readonly dynamicCoverageService: DynamicCoverageService,
    private readonly usDotIntegrationService: UsDotIntegrationService
  ) {}

  @Get('client/:clientId')
  listOneById(@Param('clientId') clientId: number) {
    return this.clientService.listOneById(clientId);
  }
  @Get('agent/:email')
  listByEmail(@Param('email') email: string) {
    return this.agentService.listByEmail(email);
  }
  @Get('agent/round-robin/:formId')
  listByOldestAssignmentDate(@Param('formId') formId: number) {
    return this.agentService.listByOldestAssignmentDate(formId);
  }
  @Get('company/:companyId')
  listByCompanyId(@Param('companyId') companyId: number) {
    return this.companyService.listByCompanyId(companyId);
  }
  @Get('agent/company/:companyId')
  listByCompany(@Param('companyId') companyId: number) {
    return this.agentService.listByCompany(companyId);
  }
  @Get('dynamic-coverage/:companyId/:dynamicRateId')
  listByCompanyAndDynamicRate(
    @Param('companyId') companyId: number,
    @Param('dynamicRateId') dynamicRateId: number
  ) {
    this.dynamicCoverageService.listByCompanyAndDynamicRate(
      companyId,
      dynamicRateId
    );
  }
  @Get('dynamic-rate/auto/:companyId')
  listByCompanyAndAutoForm(@Param('companyId') companyId: number) {
    return this.dynamicRateService.listByCompanyAndAutoForm(companyId);
  }
  @Get('dynamic-rate/form/:companyId/:formId')
  listByCompanyAndFormId(
    @Param('companyId') companyId: number,
    @Param('formId') formId: number
  ) {
    return this.dynamicRateService.listByCompanyAndFormId(companyId, formId);
  }
  @Get('dynamic-rate/home/:companyId')
  listByCompanyAndHomeForm(@Param('companyId') companyId: number) {
    return this.dynamicRateService.listByCompanyAndHomeForm(companyId);
  }
  @Get('form')
  listByCompanyAndForm() {
    return this.formService.listByCompanyAndForm();
  }
  @Get('forms')
  listAllByCompany() {
    return this.formService.listAllByCompany();
  }
  @Get('form-start')
  listByCompanyAndFormStart() {
    return this.formService.listByCompanyAndFormStart();
  }
  @Get('form/discounts/auto/:companyId')
  listByCompanyAndAutoFormDiscounts(@Param('companyId') companyId: number) {
    return this.formService.listByCompanyAndAutoFormDiscounts(companyId);
  }
  @Get('form/discounts/home/:companyId')
  listByCompanyAndHomeFormDiscounts(@Param('companyId') companyId: number) {
    return this.formService.listByCompanyAndHomeFormDiscounts(companyId);
  }
  @Get('form/auto')
  flistByCompanyAndAutoForm() {
    return this.formService.listByCompanyAndAutoForm();
  }
  @Get('form/auto-only')
  listByCompanyAndAutoFormOnly() {
    return this.formService.listByCompanyAndAutoFormOnly();
  }
  @Get('form/auto/pages')
  listByCompanyAndAutoFormPages() {
    return this.formService.listByCompanyAndAutoFormPages();
  }
  @Get('form/home-only')
  listByCompanyAndHomeFormOnly() {
    return this.formService.listByCompanyAndHomeFormOnly();
  }
  @Get('form/home/pages')
  listByCompanyAndHomeFormPages() {
    return this.formService.listByCompanyAndHomeFormPages();
  }
  @Get('form/home')
  flistByCompanyAndHomeForm() {
    return this.formService.listByCompanyAndHomeForm();
  }
  @Get('form/id/:formId/:companyId')
  flistByCompanyAndFormId(@Param('formId') formId: number) {
    return this.formService.listByCompanyAndFormId(formId);
  }
  @Get('form/type/:formType/:companyId')
  listByCompanyAndFormName(
    @Param('companyId') companyId: number,
    @Param('formType') formType: string
  ) {
    return this.formService.listByCompanyAndFormName(companyId, formType);
  }
  @Get('form/simple/:formId/:companyId')
  listByFormIdAndCompany(@Param('formId') formId: number) {
    return this.formService.listByFormIdAndCompany(formId);
  }
  @Get('form/company/:companyId')
  flistByCompanyId(@Param('companyId') companyId: number) {
    return this.formService.listByCompanyId(companyId);
  }

  @Get('pdf/one/:pdfId')
  listByIdAndClientId(@Param('pdfId') pdfId: number) {
    return this.pdfService.listByIdAndClientId(pdfId);
  }
  @Post('agent/email')
  listIdByEmail(@Body('agent') agentEmail: string) {
    return this.agentService.listIdByEmail(agentEmail);
  }
  @Patch('upsert/client')
  bulkUpdate() {
    return this.clientService.bulkUpdate();
  }
  @Patch('upsert/all/:companyId')
  upsertAll(@Param('companyId') companyId: number) {
    return this.clientService.upsertAll(companyId);
  }
  @Get('us-dot/:usDotId')
  getDataByUSDOT() {
    return this.usDotIntegrationService.getDataByUSDOT();
  }
  @Get('us-dot/:usDotId/:formId')
  getDataByUSDOTV2() {
    return this.usDotIntegrationService.getDataByUSDOTV2();
  }

  @Post()
  create(@Body() bodyObj: ClientDto) {
    return this.clientService.create(bodyObj);
  }
  @Put()
  upsert(@Body() bodyObj: ClientDto) {
    return this.clientService.upsert(bodyObj);
  }
  @Put('driver')
  dupsert(@Body() bodyObj: CreateDriverDto) {
    return this.driverService.upsert(bodyObj);
  }

  @Put('home')
  hupsert(@Body() bodyObj: CreateHomeDto) {
    return this.homeService.upsert(bodyObj);
  }
  @Put('business')
  bupsert(@Body() bodyObj: CreateBusinessDto) {
    return this.businessService.upsert(bodyObj);
  }
  @Put('location')
  lupsert(@Body() bodyObj: LocationDto) {
    return this.locationService.update(bodyObj);
  }
  @Put('incident/upsert')
  iupsert(@Body() bodyObj: CreateIncidentDto) {
    return this.incidentService.upsert(bodyObj);
  }
  @Put('recreational-vehicle/upsert')
  rupsert(@Body() bodyObj: CreateRecreationalVehicleDto) {
    return this.recreationalVehicleService.upsert(bodyObj);
  }
  @Delete('driver/:id')
  deleteDriverFromSimpleForm(@Param('id') id: number) {
    return this.driverService.deleteDriverFromSimpleForm(id);
  }
  @Delete('location/:id')
  deleteLocationFromSimpleForm(@Param('id') id: number) {
    // return this.locationService.deleteLocationFromSimpleForm(id); TODO missing this function
  }

  @Delete('delete/model/:id/:companyId/:model')
  deleteByModel() {
    return this.clientService.deleteByModel();
  }

  @Put('ezlynx/contact/:type')
  createContact(@Param('type') type: string) {
    return this.ezlynxService.createContact(null, type);
  }
}

//   router.get('/start-page/:id', (req, res, next) => startPageController.listById(req, res));

//   router.get('/discount/auto/:companyId', async (req, res, next) => await discountController.listByCompanyAndAutoForm(req, res, next));

//   router.get('/discount/form/:companyId/:formId', async (req, res, next) => await discountController.listByCompanyAndId(req, res, next));
//   router.get('/discounts/dynamic/:companyId/:formId', async(req, res, next) => await discountController.listByCompanyAndFormId(req, res, next));
//   router.get('/form-questions/:id', (req, res, next) => formController.listByPageFormId(req, res));

//   router.get('/pages/:companyId/:formId', (req, res, next) => pageController.listByCompanyAndForm(req, res));

//   router.get('/pages/form/:companyId/:formId', async(req, res, next) => await pageController.listByCompanyAndFormId(req, res,next));

//   router.get('/page/thank-you/:formType/:formId', async(req, res, next) => await pageController.listThankYouPageByCompanyAndForm(req, res, next));

//   router.get('/start-page/:companyId/:formType', async(req, res, next) => await pageController.listStartPageByCompanyAndForm(req, res, next));

//   router.get('/start-page/boolean/:companyId/:formType', async(req, res, next) => await pageController.listStartPageByCompanyAndFormBoolean(req, res, next));

//   router.get('/questions/auto/:companyId', async(req, res, next) => await questionController.listByCompanyAndPageAuto(req, res,next));

//   router.get('/questions/auto/insurance/:companyId', async (req, res, next) => {
//     await questionController.listByCompanyAndInsurancePageAuto(req, res, next);
//   });

//   router.get('/questions/home/insurance/:companyId', async (req, res, next) => {
//     await questionController.listByCompanyAndInsurancePageHome(req, res, next);
//   });

//   router.get('/questions/page/:companyId/:formId', async (req, res, next) => {
//     await questionController.listByCompanyAndPage(req, res, next);
//   });

//   router.get('/questions/auto/non-client/:companyId', async (req, res, next) => {
//     await questionController.listByCompanyAndPageAutoNonClientOnly(req, res, next);
//   });

//   router.get('/questions/home/:companyId', async(req, res, next) => await questionController.listByCompanyAndPageHome(req, res, next));

//   router.get('/questions/form/:companyId/:formId', async (req, res, next) => {
//     await questionController.listByCompanyAndForm(req, res, next);
//   });

//   router.get('/questions/simple/:companyId/:formId', async (req, res, next) => {
//     await questionController.listByCompanyAndSimpleForm(req, res, next);
//   });

//   router.get('/questions/auto/conditions/:companyId', (req, res, next) => questionController.listByCompanyAndAutoFormConditions(req, res));

//   router.get('/questions/home/conditions/:companyId', (req, res, next) => questionController.listByCompanyAndAutoFormConditions(req, res));
//   router.get('/answers/defaultValue/:companyId/:formId', async (req, res, next) => {
//     await answerController.listByDefaultValue(req, res, next);
//   });

//   router.get('/answers/form/:formId/:companyId', async (req, res, next) => {
//     await answerController.listByCompanyAndFormId(req, res, next);
//   });

//   router.get('/answers/page/all/:pageId', async (req, res, next) => {
//     await answerController.listByPage(req, res, next);
//   });

//   router.get('/answers/commercial/all/:companyId', async (req, res, next) => {
//     await answerController.listByCompanyAndCommercialForm(req, res, next);
//   });

//   router.get('/answers/simple/:companyId/:formId', async (req, res, next) => {
//     await answerController.listByCompanyAndSimpleForm(req, res, next);
//   });

//   router.get('/answers/form/only/:companyId/:formId', async (req, res, next) => {
//     await answerController.listByCompanyAndFormAnswersOnly(req, res, next);
//   });

//   router.get('/answers/:companyId/:questionId', (req, res, next) => answerController.listByCompanyAndQuestion(req, res));

//   router.post('/answers/salesforce/:companyId/:formId', (async (req, res, next) => {
//     await answerController.updateAnswersFromSF(req, res, next);
//   }));
//   router.patch('/answers/pageId', (async (req, res, next) => {
//     await answerController.updateWithPageId(req, res, next);
//   }));

//   router.patch('/answers/formId', (async (req, res, next) => {
//     await answerController.updateWithFormId(req, res, next);
//   }));
//   router.patch('/answers/form/:companyId', (async (req, res, next) => {
//     await answerController.listByCompanyAndForm(req, res, next);
//   }));
//   router.put('/vehicle', async (req, res, next) => {
//     await vehicleController.upsert(req, res, next);
//   });
//   router.post('/commercial', (req, res) => commercialController.create(req, res));
//   router.delete('/vehicle/:id', async (req, res, next) => {
//     await vehicleController.deleteVehicleFromSimpleForm(req, res, next);
//   });
