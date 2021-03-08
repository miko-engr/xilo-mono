import { Controller, Get, Post, Patch, Put, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('vendor')
export class VendorController {

    constructor(private readonly vendorService: VendorService) {}

    /**
     * Create new vendor 
     */
    @Post('add')
    create() {
        return this.vendorService.create()
    }

    /**
     * Upsert vendor 
     */
    @Patch('upsert')
    upsert() {
        return this.vendorService.upsert()
    }

    /**
     * Return best rate
     */
    @Put('rate')
    getBestRate() {
        return this.vendorService.getBestRate()
    }

    /**
     * Returns get all rates 
     */
    @Put('rates')
    getAllRates() {
        return this.vendorService.getAllRates()
    }

    /**
     * Return get vendors name
     */
    @Get('')
    getVendorNames() {
        return this.vendorService.getVendorNames()
    }

    /**
     * return rate by id
     */
    @Get('rate/:clientId')
    getRateById() {
        return this.vendorService.getRateById()
    }

}
