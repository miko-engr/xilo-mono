import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDate,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { CreateCoverageDto } from '../../coverage/dto/create-coverage.dto';
export class CreateRaterDto {
  @IsNumber() readonly id?: number;
  @IsString() @IsNotEmpty() title: string;
  @IsString() carrier: string;
  @IsString() state: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsBoolean() isAuto: boolean;
  @IsBoolean() isHome: boolean;
  @IsNumber() companyRaterId: number;
  @IsNumber() formRaterId: number;
  @IsArray() coverages?: CreateCoverageDto[];
  @IsArray() parameters?: any[]; // TODO should be Parameters[];
}
