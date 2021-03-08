import { IsNumber, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class TextMessageDto {
    @IsOptional() @IsNumber() @IsNotEmpty() readonly id: number;
    @IsOptional() @IsNumber() @IsNotEmpty() to: number;
    @IsOptional() @IsString() body: string;
    @IsOptional() @IsString() scheduledDate: string;
    @IsOptional() @IsNumber() clientTextMessageId: number;
    @IsOptional() @IsBoolean() isSentNow: true
}