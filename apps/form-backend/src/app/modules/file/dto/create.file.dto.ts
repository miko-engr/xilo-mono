import { IsNumber, IsString, IsDate } from 'class-validator';
import { isString } from 'util';

export class CreateFileDto {
  @IsNumber() readonly id?: number;
  @IsString() title: string;
  @IsString() file: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
}
