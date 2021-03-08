import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreateCoverageDto {
  @IsNumber() readonly id?: number;
  @IsString() @IsNotEmpty() readonly title: string;
  @IsBoolean() readonly isAuto: boolean;
  @IsBoolean() readonly isHome: boolean;
  @IsNumber() readonly basePrice: number;
  @IsNumber() readonly minPrice: number;
  @IsNumber() readonly maxPrice: number;
  @IsBoolean() readonly isMonthly: boolean;
  @IsBoolean() readonly isAnnual: boolean;
  @IsNumber() @IsNotEmpty() readonly position: number;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() readonly liabilityLimit: string;
  @IsString() readonly deductible: string;
  @IsBoolean() readonly hasMarketValue: boolean;
  @IsBoolean() readonly hasDwellingCoverage: boolean;
  @IsString() readonly image: string;
  @IsNumber() readonly estimationCoverageId: number;
  @IsNumber() readonly raterCoverageId: number;
  @IsNumber() readonly companyCoverageId: number;
}
