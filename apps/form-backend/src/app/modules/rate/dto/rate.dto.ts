import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class RateDto  {
  @IsOptional() @IsNumber() @IsNotEmpty() readonly id: number;
  @IsNotEmpty() @IsString() createdAt: string;
  @IsNotEmpty() @IsString() updatedAt: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly title: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly price: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly type: string;
  @IsOptional() @IsString() @IsNotEmpty() clientRateId: number;
  @IsOptional() @IsString() @IsNotEmpty() companyRateId: number;
  @IsOptional() @IsNumber() @IsNotEmpty() companyRaterId: number;
  @IsOptional() @IsNumber() @IsNotEmpty() coverageRateId: number;
  @IsOptional() @IsNumber() @IsNotEmpty() homeRateId: number;
  @IsOptional() @IsNumber() @IsNotEmpty() vehicleRateId: number;
}