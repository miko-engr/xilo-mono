import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class TemplateDto {
  @IsOptional() @IsNumber() readonly id?: number;
  @IsOptional() @IsString() title: string;
  @IsOptional() @IsString() createdAt: string;
  @IsOptional() @IsString() updatedAt: string;
  @IsOptional() @IsString() body: string;
  @IsOptional() @IsBoolean() isText: boolean;
  @IsOptional() @IsBoolean() isEmail: boolean;
  @IsOptional() @IsString() subject: string;
  @IsOptional() @IsBoolean() isTask: boolean;
  @IsOptional() @IsString() type: string;
  @IsOptional() @IsString() description: string;
  @IsOptional() @IsString() priority: string;
  @IsOptional() @IsNumber() companyTemplateId: number;
}
