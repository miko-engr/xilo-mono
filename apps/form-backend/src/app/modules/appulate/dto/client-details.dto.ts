import { IsString } from 'class-validator';

export class ClientDetailsDto {
  @IsString() clientId: string;
  @IsString() pdfId: string; 
}
