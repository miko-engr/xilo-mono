import { IsOptional, IsString, IsNumber, IsDate, IsNotEmpty, IsObject } from 'class-validator';

export class ZapiersyncsDto {
    @IsOptional() @IsNumber() @IsNotEmpty() id: number;
    @IsOptional() @IsString() companyId: number | null;
    @IsOptional() @IsString() model: string | null;
    @IsOptional() @IsDate() lastSyncTime: Date | null;
    @IsOptional() @IsDate() agentLastSyncTime: Date | null;
    @IsOptional() @IsDate() eventLastSyncTime: Date | null;
    @IsOptional() @IsDate() lifecycleLastSyncTime: Date | null;
    @IsOptional() @IsObject() data: object | null;
    @IsOptional() @IsString() email: string | null;
    @IsOptional() @IsString() name: string | null;
}