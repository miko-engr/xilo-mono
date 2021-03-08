import {
  IsString,
  IsDate,
  IsObject,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
export class CreateDynamicCoverageDto {
  @IsNumber() readonly id?: number;
  @IsString() @IsNotEmpty() title: string;
  @IsObject() specs: object[];
  @IsNumber() premiumIncrease: number;
  @IsNumber() @IsNotEmpty() position: number;
  @IsString() image: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsNumber() companyDynamicCoverageId: number;
}
