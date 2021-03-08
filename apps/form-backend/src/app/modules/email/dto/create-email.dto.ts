import { IsNumber, IsString, IsDate, IsBoolean, IsOptional } from 'class-validator';

export class CreateEmailDto {
  @IsOptional()  @IsNumber() readonly id?: number;
  @IsOptional() @IsString() recipient: string;
  @IsOptional() @IsString() sender: string;
  @IsOptional() @IsString() subject: string;
  @IsOptional() @IsString() body: string;
  @IsOptional() @IsDate() scheduledDate: Date;
  @IsOptional() @IsBoolean() isSchedule: boolean;
  @IsOptional() @IsString() replyStatus: string;
  @IsOptional() @IsString() replyErrorMessage: string;
  @IsOptional() createdAt: Date = new Date();
  @IsOptional() updatedAt: Date = new Date();
  @IsOptional() @IsBoolean() isSentNow: boolean;
  @IsOptional() @IsString() status: string;
  @IsOptional() @IsBoolean() fromClient: boolean;
  @IsOptional() @IsString() responseUid: string;
  @IsOptional() @IsNumber() clientEmailId: number;
  @IsOptional() @IsNumber() companyEmailId: number;
  @IsOptional() @IsNumber() flowEmailId: number;
}
