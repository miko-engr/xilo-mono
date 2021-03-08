import { Controller, Post, Body } from '@nestjs/common';
import { CityDistanceService } from './city-distance.service';
import { CityDetailDTO } from './dto/city-details.dto';

@Controller('city-distance')
export class CityDistanceController {
    constructor(
        private readonly cityDistanceService: CityDistanceService
    ) {}
    
    /**
     * return city distance calculation result
     */
    @Post('/')
    loopThroughCities(@Body() cityDetails: CityDetailDTO) {
        return this.cityDistanceService.loopThroughCities(cityDetails);
    }
 }
