import { IsNumber, IsDate, IsString } from 'class-validator';

export class CreateRecreationalVehicleDto {
  @IsNumber() readonly id?: number;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() type: string;
  @IsNumber() clientRecreationalVehicleId: number;
}
