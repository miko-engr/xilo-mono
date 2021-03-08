import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsObject } from 'class-validator';

export class ParameterDto {
  @IsOptional() @IsString() @IsNotEmpty() readonly title: string;
  @IsNotEmpty() createdAt: Date = new Date();
  @IsNotEmpty() updatedAt: Date = new Date();
  @IsOptional() @IsBoolean() @IsNotEmpty() readonly isDriver: boolean;
  @IsOptional() @IsBoolean() @IsNotEmpty() readonly isVehicle: boolean;
  @IsOptional() @IsString() @IsNotEmpty() readonly propertyKey: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly conditionalValue: string;
  @IsOptional() @IsNumber() @IsNotEmpty() readonly percentChange: number;
  @IsOptional() @IsNumber() @IsNotEmpty() readonly answerParameterId: number;
  @IsOptional() @IsNumber() @IsNotEmpty() readonly companyParameterId: number;
  @IsOptional() @IsObject() readonly decodedUser: object;
}

export class UpdateParameterDto {
  @IsOptional() @IsNumber() @IsNotEmpty() readonly id: number;
  @IsOptional() @IsString() @IsNotEmpty() readonly title: string;
  @IsNotEmpty() updatedAt: Date = new Date();
  @IsOptional() @IsBoolean() @IsNotEmpty() readonly isDriver: boolean;
  @IsOptional() @IsBoolean() @IsNotEmpty() readonly isVehicle: boolean;
  @IsOptional() @IsString() @IsNotEmpty() readonly propertyKey: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly conditionalValue: string;
  @IsOptional() @IsNumber() @IsNotEmpty() readonly percentChange: number;
  @IsOptional() @IsNumber() @IsNotEmpty() readonly answerParameterId: number;
  @IsOptional() @IsNumber() @IsNotEmpty() readonly companyParameterId: number;
  @IsOptional() @IsObject() readonly decodedUser: object;
}
