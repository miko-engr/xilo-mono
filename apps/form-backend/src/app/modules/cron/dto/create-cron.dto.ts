import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreateCronDto {
  @IsNumber() readonly id?: number;
  @IsString() @IsNotEmpty() readonly name: string;
  @IsBoolean() readonly isScheduled: boolean;
  @IsBoolean() readonly isNewClient: boolean;
  @IsBoolean() @IsNotEmpty() readonly companyCronId: number;
  @IsNumber() @IsNotEmpty() readonly agentCronId: number;
  @IsNumber() @IsNotEmpty() readonly clientCronId: number;
  @IsString() readonly message: string;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
}
