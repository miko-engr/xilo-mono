import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';

import { CompanyService } from './company.service';
import { CompanyDto } from './dto/company.dto';
import { AuthGuard } from '../../guards/auth.guard';
/**
 * Company Controller
 */
@UseGuards(AuthGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * @param {number} id  The id of the Company
   * @returns One company information given an id
   */
  @Get('profile/:id')
  getById(@Param('id') id: number) {
    return this.companyService.getById(id);
  }

  /**
   * @param {number} id  The id of the Company
   * @returns One company information with lifecycles array
   */
  @Get('lifecycles/all/:id')
  listLifecycles(@Param('id') id: number) {
      return this.companyService.listLifecycles(id);
  }

  /**
   * @returns One company information with lifecycles and agents
   */
  @Get('get/agent')
  listByAgent(@Body() companyDto: CompanyDto) {
      return this.companyService.listByAgent(companyDto);
  }

  /**
   * @returns Key pair value from all module related to client, company, driver, vehicle
   */
  @Get('array/keys')
  listLabelsInArray() {
      return this.companyService.listLabelsInArray();
  }

  /**
   * @param {string} type module type
   * @param {string} key module key
   * @returns Key pair value from all module based on type and keys
   */
  @Get('keys/:type/:key')
  listLabels(@Param('type') type: string, @Param('key') key: string) {
      return this.companyService.listLabels(type, key);
  }

  /**
   * @param {number} id company id
   * @returns updated company information
   */
  @Patch(':id')
  update(@Param('id') id: number, @Body() companyDto: CompanyDto) {
      return this.companyService.update(id, companyDto);
  }

  /**
   * @param {number} id company id
   * @returns updated company with new brand color
   */
  @Patch('/brand-color/change/:id')
  updateBrandColors(@Param('id') id: number, @Body() companyDto: CompanyDto) {
      return this.companyService.updateBrandColors(id, companyDto);
  }

}
