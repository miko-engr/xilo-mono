import {
  IsNumber,
  IsDate,
  IsArray,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { CreateCoverageDto } from '../../coverage/dto/create-coverage.dto';
import { CreateFormDto } from '../../form/dto/create.form.dto';
import { ParameterDto } from '../../parameter/dto/parameter.dto';
export class CreateDynamicRaterDto {
  @IsNumber() readonly id?: number;
  @IsString() @IsNotEmpty() title: string;
  @IsString() state: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsNumber() companyDynamicRaterId: number;
  @IsArray() coverages: CreateCoverageDto[];
  @IsArray() forms: CreateFormDto[];
  @IsArray() parameters: ParameterDto[];
}
