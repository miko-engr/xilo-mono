import { Injectable, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locations } from './location.entity';
import { Location } from './interface/location.interface';

@Injectable({ scope: Scope.REQUEST })
export class LocationService {
  constructor(
    @InjectRepository(Locations)
    private locationRepository: Repository<Locations>,
  ) {}

  async findOne(id: number): Promise<Location> {
    try {
      const location = await this.locationRepository.findOne({
        where: { id },
      });

      if (!location)
        throw new HttpException('Location not found!', HttpStatus.BAD_REQUEST);

      return location;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getLocationByCompanyId(locationDto): Promise<Location> {
    try {
      const decoded = locationDto.decodedUser;
      const location = await this.locationRepository.findOne({
        where: {
          companyLocationId: decoded.user.companyUserId,
        },
      });

      if (!location)
        throw new HttpException('Location not found!', HttpStatus.BAD_REQUEST);

      return location;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
                                                                                                                                                                                                                                                                                                                                  
  async create(locationDto): Promise<Location> {
    try {
      const location = await this.locationRepository.save(locationDto);
      return location;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(locationDto){
    try {
      const location = await this.locationRepository.findOne(locationDto.id);
      let locationResult;
      if(!location) {
        return locationResult = await this.locationRepository.save(locationDto);
      }
      const updated = Object.assign(location, locationDto);
      locationResult = await this.locationRepository.save(updated);
      return locationResult;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number) {
    try {
      const location = await this.locationRepository.delete(id);
      if(location.affected === 0) {
        throw new HttpException('Location not deleted!', HttpStatus.BAD_REQUEST);
      }
      return { message: 'Location deleted successfully' }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
