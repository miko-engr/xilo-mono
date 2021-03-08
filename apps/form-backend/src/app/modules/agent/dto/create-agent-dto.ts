import {
  IsString,
  IsInt,
  IsDate,
  IsBoolean,
  IsArray,
  IsObject,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsOptional
} from 'class-validator';
export class CreateAgentDto {
  @IsNumber() readonly id?: number;
  @IsString() readonly name?: string;
  @IsEmail() readonly email: string;
  @IsDate() readonly createdAt: Date;
  @IsDate() readonly updatedAt: Date;
  @IsString() password?: string;
  @IsInt() readonly companyAgentId?: number;
  @IsBoolean() readonly isPrimaryAgent?: boolean;
  @IsString() readonly firstName?: string;
  @IsString() readonly lastName?: string;
  @IsString() readonly lineOfBusiness?: string;
  @IsBoolean() readonly canSeeAllClients?: boolean;
  @IsArray() readonly tags?: string[];
  @IsBoolean() readonly canSeeTagsOnly?: boolean;
  @IsString() readonly producerCode?: string;
  @IsString() readonly executiveCode?: string;
  @IsArray() readonly agentIds?: number[];
  @IsBoolean() readonly canSeeAgentsOnly?: boolean;
  @IsObject() readonly notificationJson?: object;
  @IsString() readonly phone?: string;
  @IsObject() readonly settings?: object;
  @IsDate() readonly lastAssignmentDate?: Date;
  @IsString() readonly betterAgencyUsername?: string;
}
