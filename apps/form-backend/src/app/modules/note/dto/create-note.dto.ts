import { IsSemVer, IsString, IsDate, IsNumber } from 'class-validator';

export class CreateNoteDto {
  @IsSemVer() id?: number;
  @IsString() text: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsNumber() companyNoteId?: number;
  @IsNumber() agentNoteId?: number;
  @IsNumber() clientNoteId?: number;
  @IsNumber() userNoteId?: number;
}
