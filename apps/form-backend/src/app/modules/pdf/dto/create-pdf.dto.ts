import { IsNumber, IsString, IsBoolean, IsDate, IsJSON } from 'class-validator';

export class CreatePdfDto {
  @IsNumber() id?: number;
  @IsNumber() pdfId?: number;
  @IsString() fileName: string;
  @IsBoolean() isTemplate: boolean;
  @IsJSON() fields: any;
  @IsString() formName: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() exportValues: string;
  @IsNumber() companyId?: number;
}
