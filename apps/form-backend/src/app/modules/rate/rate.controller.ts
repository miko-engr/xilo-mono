import { Controller, Get, Patch, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateDto } from './dto/rate.dto';
import { AuthGuard } from '../../guards/auth.guard'
@UseGuards(AuthGuard)
@Controller('rate')
export class RateController {
    constructor(private readonly rateService: RateService) {}

    /**
     * 
     * @param companyId company id
     * @param clientId clientId
     */
    @Get('client/:companyId/:clientId')
    listByClient(
        @Param('companyId') companyId: number,
        @Param('clientId') clientId: number
    ) {
        return this.rateService.listByClient(companyId, clientId)
    }

    /**
     * 
     * @param id : rate Id
     */
    @Get(':id')
    listOne(@Param('id') id: number) {
        return this.rateService.listOne(id)
    }

    /**
     * 
     * @param id :  rate id
     * @param rateDto : object which contains updated record
     */
    @Patch(':id')
    update(@Param('id') id: number, @Body() rateDto: RateDto) {
        return this.rateService.update(id, rateDto)
    }

    @Post('')
    create(@Body() rateDto: RateDto) {
        return this.rateService.create(rateDto)
    }
    /**
     * 
     * @param id : rate id
     */
    @Delete(':id')
    deleteRate(@Param('id') id: number) {
        return this.rateService.deleteRate(id)
    }

}
