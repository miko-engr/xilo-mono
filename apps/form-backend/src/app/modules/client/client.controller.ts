import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Delete,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDto } from './dto/client.dto';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  /**
   * @returns List of clients
   */
  @Get('all/clients')
  list() {
    return this.clientService.list();
  }

  /**
   * @param {number} clientId The id of the client
   * @returns message about deleted client
   */
  @Delete('user/:clientId')
  userDeleteClient(@Param('clientId') clientId: number) {
    return this.clientService.userDeleteClient(clientId);
  }

  /**
   * @param {number} clientId The id of the client
   * @returns message about deleted client
   */
  @Delete('agent/:clientId')
  agentDeleteClient(@Param('clientId') clientId: number) {
    return this.clientService.agentDeleteClient(clientId);
  }

  /**
   * @param {number} id The id of the client
   * @returns return generated new token
   */
  @Post('generate-token')
  createToken(@Body() clientBody) {
    return this.clientService.createToken(clientBody['id'])
  }

  /**
   * @body {number[]} clientIds The clientIds array
   * @returns message for success or error
   */
  @Patch('delete/multiple/prospects')
  deleteMultipleProspects(@Body() clients: number[]) {
    return this.clientService.deleteMultipleProspects(clients)
  }

  /**
   * @param {number} companyId The id of the company
   * @returns return client with there company details
   */
  @Get('client-app/:companyId')
  listOne(@Param('companyId') companyId: number) {
    return this.clientService.listOne(companyId)
  }

  /**
   * @returns list of clients based on token 
   */
  @Get('profile/user')
  listByUser() {
    return this.clientService.listByUser();
  }

  /**
   * @returns list of agents based on token 
   */
  @Get('profile/agent')
  listByAgent() {
    return this.clientService.listByAgent();
  } 

  /**
   * @param {number} id The id of the client
   * @returns client along with there connected module like vehicle, driver
   */
  @Get('/:id')
  listOneClient(@Param('id') id: number) {
    return this.clientService.listOneClient(id)
  }

  /**
   * @param {number} id The id of the client
   * @returns agent information with id
   */
  @Get('agent/:id')
  listOneByAgent(@Param('id') id: number) {
    return this.clientService.listOneByAgent(id)
  }

  /**
   * @param {number} id The id of the client
   * @returns user information with id
   */
  @Get('user/:id')
  listOneByUser(@Param('id') id: number) {
    return this.clientService.listOneByUser(id)
  }

  /**
   * @returns updated agent client information
   */
  @Patch('agent')
  agentUpdateClient(@Body() clientBody: object) {
    return this.clientService.agentUpdateClient(clientBody)
  }

  /**
   * @returns updated agent client information
   */
  @Patch('update-client-agent')
  updateClientAgent(@Body() clientBody: object) {
    return this.clientService.updateClientAgent(clientBody)
  }

  @Post('/addToNewLeadFlow')
  addToNewLeadFlow() {
    return this.clientService.addToNewLeadFlow();
  }

  /**
   * @returns clients current flow's information
   */

  @Get('/getClientFlows/:id')
  getClientFlows(@Param('id') id: number) {
    return this.clientService.getClientFlows(id)
  }

  /**
   * @returns url of current signed document
   */
  @Get('/signed-document-url/:documentId')
  getSignedDocumentUrl(@Param('documentId') documentId: number) {
    return this.clientService.getSignedDocumentUrl(documentId)
  }

  @Delete('removeFromFlow/:clientId')
  removeFromFlow() {
    return this.clientService.removeFromFlow();
  }

  /**
   * @returns clients with there messages
   */
  @Get('sales-automation/clients')
  listByMessages() {
    return this.clientService.listByMessages();
  }

  @Get('data/person-enrichment')
  personEnrichment() {
    return this.clientService.personEnrichment();
  }

  /**
   * @returns object with client information
   */
  @Post('addToFlow')
  addToFlow(@Body() clientBody: object) {
    return this.clientService.addToFlow(clientBody)
  }

  @Patch('viewChildClient')
  viewChildClient(@Body() clientDto: ClientDto) {
    return this.clientService.update(clientDto)
  }

  @Patch('company/:id')
  companyUpdateClient(@Param('id') id: number, @Body() clientDto: ClientDto) {
    return this.clientService.companyUpdateClient(id, clientDto)
  }

  @Patch()
  update(@Body() clientBody: ClientDto) {
    return this.clientService.update(clientBody)
  }

  @Get('thank-you/:lifecycleId/:agentId')
  emailUpdateClient(@Param('lifecycleId') lifecycleId: number, @Param('agentId') agentId: number, @Res() res) {
    return this.clientService.emailUpdateClient(lifecycleId, agentId, res)
  }

  /**
   * @returns array of client with date and company
   */
  @Get('filter/date/:limit/:page')
  listByDateAndCompany(@Req() request: Request) {
    return this.clientService.listByDateAndCompany(request)
  }

  /**
   * @returns client's count
   */
  @Get('filter/count')
  countByFilterParams(@Req() request: Request) {
    return this.clientService.countByFilterParams(request)
  }

  /**
   * @returns array of client with filter parameters
   */
  @Get('params/:id/:params')
  listOneByParams(@Req() request: Request) {
    return this.clientService.listOneByParams(request)
  }

  /**
   * @returns uploded document with there id 
   */
  @Post('/upload-document')
  uploadSecureDocument(@Req() request: Request, @Res() response: Response) {
    return this.clientService.uploadSecureDocument(request, response)
  }
  
}
