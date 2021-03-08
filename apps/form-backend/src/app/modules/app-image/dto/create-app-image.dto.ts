import { IsNumber, IsString, IsDate, IsBoolean } from 'class-validator';

export class CreateAppImageDto {
  @IsNumber() id?: number;
  @IsString() image: string;
  @IsString() form: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsBoolean() isSvg: boolean;
  @IsString() imageUrl: string;
}
