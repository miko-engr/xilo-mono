import {
  IsNumber,
  IsString,
  IsBoolean,
  IsDate,
  IsArray,
} from 'class-validator';

export class CreateFlowDto {
  @IsNumber() readonly id?: number;
  @IsString() title: string;
  @IsBoolean() isEnabled: boolean;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsBoolean() isNewClientFlow: boolean;
  @IsArray() sequence: object[];
  @IsNumber() companyFlowId: number;
}
