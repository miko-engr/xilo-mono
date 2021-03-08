import { IsNumber, IsDate, IsString } from 'class-validator';

export class CreateIncidentDto {
  @IsNumber() readonly id?: number;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() type: string;
  @IsString() description: string;
  @IsDate() date: Date;
  @IsString() amount: string;
  @IsString() propertyDamage: string;
  @IsString() bodilyInjury: string;
  @IsString() collision: string;
  @IsString() medicalPayment: string;
  @IsString() vehicleIndex: string;
  @IsString() catLoss: string;
  @IsNumber() clientIncidentId: number;
  @IsNumber() driverIncidentId: number;
  @IsNumber() vehicleIncidentId: number;
}
