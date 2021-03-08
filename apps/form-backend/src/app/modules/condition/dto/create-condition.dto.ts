import { IsString, IsDate, IsNumber } from 'class-validator';
export class CreateConditionDto {
  @IsNumber() id?: number;
  @IsDate() readonly createdAt: Date;
  @IsDate() readonly updatedAt: Date;
  @IsString() readonly title: string;
  @IsString() readonly object: string;
  @IsString() readonly key: string;
  @IsString() readonly operator: string;
  @IsString() readonly value: string;
  @IsNumber() companyConditionId: number;
}
