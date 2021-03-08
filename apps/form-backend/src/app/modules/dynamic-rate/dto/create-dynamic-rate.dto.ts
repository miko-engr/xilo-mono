import { IsNumber, IsBoolean, IsDate, IsArray } from 'class-validator';
import { CreateDynamicParameterDto } from '../../dynamic-parameter/dto/create-dynamic-parameter.dto';
import { CreateDynamicCoverageDto } from '../../dynamic-coverage/dto/create-dynamic-coverage.dto';
export class CreateDynamicRateDto {
  @IsNumber() readonly id?: number;
  @IsNumber() min: number;
  @IsNumber() max: number;
  @IsNumber() base: number;
  @IsBoolean() hasReplacementCost: boolean;
  @IsNumber() costPerSqFt: number;
  @IsNumber() avBaseSqFt: number;
  @IsNumber() premiumIncreasePerSqFt: number;
  @IsBoolean() isAnnual: boolean;
  @IsBoolean() isMonthly: boolean;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsNumber() companyDynamicRateId: number;
  @IsBoolean() hasMultiplyByVehicles: boolean;
  @IsNumber() formDynamicRateId?: number;
  @IsArray() dynamicParameters?: CreateDynamicParameterDto[];
  @IsArray() dynamicCoverages?: CreateDynamicCoverageDto[];
}
