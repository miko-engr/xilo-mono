import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class LifecycleAnalyticsDto  {
  @IsOptional() @IsNumber() @IsNotEmpty() readonly id: number;
  @IsNotEmpty() @IsString() createdAt: string;
  @IsNotEmpty() @IsString() updatedAt: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly date: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly month: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly day: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly year: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly companyLifecycleAnalyticId: number;
  @IsOptional() @IsString() @IsNotEmpty() readonly insuranceType: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly medium: string;
  @IsOptional() @IsString() @IsNotEmpty() readonly landingPage: string;
  @IsOptional() @IsString() @IsNotEmpty() lifecycleLifecycleAnalyticId: number;
  @IsOptional() @IsString() @IsNotEmpty() readonly clientLifecycleAnalyticId: number;
  @IsOptional() @IsString() @IsNotEmpty() readonly agentLifecycleAnalyticId: number;
}
