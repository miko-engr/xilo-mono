import {
  Controller,
  Get,
  Param,
  Put,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationDto } from './dto/location.dto';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  /**
   * @returns location by company id
   */
  @Get('')
  getLocationByCompanyId(@Body() locationDto: LocationDto) {
    return this.locationService.getLocationByCompanyId(locationDto);
  }

  /**
   * @param {number} id The id of the location
   * @returns location by id
   */
  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.locationService.findOne(id);
  }

  /**
   * @param {Location} location  The location object to create location
   * @returns created location object
   */
  @Post('')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() locationDto: LocationDto) {
    return this.locationService.create(locationDto);
  }

  /**
   * @param {Location} location Then location object to create or update
   * @returns created or update a location
   */
  @Put('')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Body() locationDto: LocationDto) {
    return this.locationService.update(locationDto);
  }

  /**
   * @param {Location} location Then location object to create or update
   * @returns created or update a location
   */
  @Patch('/upsert')
  upsert(@Body() locationDto: LocationDto) {
    return this.locationService.update(locationDto);
  }  

  /**
   * @param {number} id   The id of the location
   * @returns success or error message
   */
  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.locationService.delete(id);
  }

}
