import { IsString,  } from 'class-validator';

export class ContractDetailsDto {
  @IsString() vendorName: string;
  @IsString() zipFilebuffer?: string; 
}
