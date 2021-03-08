import { Injectable, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { cities } from './city-list';
import { CityDetailDTO } from './dto/city-details.dto';

@Injectable({ scope: Scope.REQUEST })
export class CityDistanceService {
    
    toRad(Value: number): number {
        try {
            /** Converts numeric degrees to radians */
            return Value * Math.PI / 180;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    findDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        try {
            const R = 6371; // km
            const dLat: number = this.toRad(lat2 - lat1);
            const dLon: number = this.toRad(lon2 - lon1);
            lat1 = this.toRad(lat1);
            lat2 = this.toRad(lat2);
            const a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2)
                    * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d: number = (R * c) / 1.609; // convert to miles
            
            return d;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    loopThroughCities(cityDetils: CityDetailDTO) {
        try {
            const current: Array<object> = [
                {
                city: '',
                lat: cityDetils.lat,
                long: cityDetils.lng,
                },
            ];
            const { minDistance } = cityDetils;
            for (let i = 0; i < cities.length; i++) {
                const lat1 = current[0]['lat'];
                const lon1 = current[0]['long'];
                const lat2 = cities[i]['lat'];
                const lon2 = cities[i]['lng'];
                const distance: number = this.findDistance(lat1, lon1, lat2, lon2);

                if (distance < minDistance) {
                    return {
                        title: 'Distance calculated successfully.',
                        isCloseToCity: true,
                    };
                }
            }
            return {
                title: 'Distance calculated successfully.',
                isCloseToCity: false,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}