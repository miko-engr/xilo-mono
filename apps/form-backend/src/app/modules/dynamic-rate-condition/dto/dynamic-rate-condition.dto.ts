import {IsNotEmpty, IsNumber, IsArray, IsString } from 'class-validator';

export class DynamicRateConditionDto  {
    @IsNumber() @IsNotEmpty() readonly id: number;
    @IsArray() conditions: object[] | null;
    @IsString() createdAt: string;
    @IsString() updatedAt: string;
    @IsNumber() answerDynamicParameterId: number;
    @IsNumber() companyDynamicParameterId: number;
    @IsNumber() dynamicRateDynamicParameterId: number;
}