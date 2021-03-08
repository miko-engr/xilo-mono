import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsObject,
  IsBoolean,
  IsOptional,
} from 'class-validator';
export class CreateUserDto {
  @IsOptional() @IsNumber() id?: number;
  @IsNotEmpty() createdAt: Date = new Date();
  @IsNotEmpty() updatedAt: Date = new Date();
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() @IsNotEmpty() username: string;
  @IsOptional() @IsString() @IsNotEmpty() firstName: string;
  @IsOptional() @IsString() @IsNotEmpty() lastName: string;
  @IsOptional() @IsString() @IsNotEmpty() password: string;
  @IsOptional() @IsString() resetPasswordLink: string;
  @IsOptional() @IsString() xanatekProducerId: string;
  @IsOptional() @IsString() xanatekCsrId: string;
  @IsOptional() @IsObject() settings: object;
  @IsOptional() @IsBoolean() showReport: boolean;
  @IsOptional() @IsBoolean() sendReport: boolean;
  @IsOptional() @IsBoolean() isAdmin: boolean;
  @IsOptional() @IsNumber() companyUserId: number;
  @IsOptional() @IsNumber() companyNoteId: number;
}
