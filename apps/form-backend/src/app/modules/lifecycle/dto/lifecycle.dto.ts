import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class LifecycleDto {
  @IsOptional() @IsNumber() @IsNotEmpty() readonly id: number;
  @IsOptional() @IsBoolean() isEnabled: boolean | null;
  @IsOptional() @IsBoolean() isNewClient: boolean | null;
  @IsOptional() @IsBoolean() isSold: boolean | null;
  @IsOptional() @IsString() name: string | null;
  @IsOptional() @IsString() color: string | null;
  @IsNumber() sequenceNumber: number | null;
  @IsNotEmpty() createdAt: Date = new Date();
  @IsNotEmpty() updatedAt: Date = new Date();
  @IsOptional() @IsBoolean() isQuoted: boolean | null;
  @IsOptional() @IsNumber() targetYear: number | null;
  @IsOptional() @IsNumber() targetMonth: number | null;
  @IsOptional() @IsNumber() targetWeek: number | null;
  @IsOptional() @IsNumber() targetDay: number | null;
  // @IsNumber() companies: number | null;
}