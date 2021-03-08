import { IsNumber, IsDate, IsString, IsBoolean } from 'class-validator';

export class CreateTasksDto {
  @IsNumber() readonly id?: number;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() type: string;
  @IsString() description: string;
  @IsString() priority: string;
  @IsString() scheduledDate: string;
  @IsBoolean() isSchedule: boolean;
  @IsBoolean() isSentNow: boolean;
  @IsBoolean() isCompleted: boolean;
  @IsString() completedDate: string;
  @IsString() reminderDate: string;
  @IsBoolean() reminderSent: boolean;
  @IsNumber() agentTaskId: number;
  @IsNumber() clientTaskId: number;
  @IsNumber() companyTaskId: number;
}
