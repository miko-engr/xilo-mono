import { IsNumber } from 'class-validator';
export class CityDetailDTO {
    @IsNumber() lat: number;
    @IsNumber() lng: number; 
    @IsNumber() minDistance: number;
}