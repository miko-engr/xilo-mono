import {
  IsString,
  IsInt,
  IsDate,
  IsBoolean,
  IsArray,
  IsObject,
  IsEmail,
  IsNumber,
} from 'class-validator';
export class CreateDynamicParameterDto {
  @IsNumber() id?: number;
  @IsObject() conditions: object[];
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsNumber() answerDynamicParameterId?: number;
  @IsNumber() companyDynamicParameterId?: number;
  @IsNumber() dynamicRateDynamicParameterId?: number;
}
