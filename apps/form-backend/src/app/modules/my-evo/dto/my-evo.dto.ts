import { IsNumber, IsArray, IsOptional } from 'class-validator';

export class MyEvoDto {
  @IsOptional() @IsNumber() readonly id?: number;
  @IsArray() clientIds;
}
