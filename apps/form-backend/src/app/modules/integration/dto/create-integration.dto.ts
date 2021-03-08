import {
  IsNumber,
  IsString,
  IsBoolean,
  IsDate,
  IsArray,
  IsObject,
} from 'class-validator';
export class CreateIntegrationDto {
  @IsNumber() id?: number;
  @IsString() vendorName: string;
  @IsString() parentGroup: string;
  @IsString() group: string;
  @IsString() element: string;
  @IsString() processLevel: string;
  @IsString() subLevel: string;
  @IsString() xiloObject: string;
  @IsString() xiloKey: string;
  @IsString() value: string;
  @IsNumber() index: number;
  @IsObject() transformation: object;
  @IsDate() createdAt: Date;
  @IsDate() updatedAt: Date;
  @IsString() arrayKey: string;
  @IsString() al3Length: string;
  @IsString() parentIndex: string;
  @IsString() parentProcessLevel: string;
  @IsBoolean() iterative: boolean;
  @IsBoolean() required: boolean;
  @IsNumber() sequence: number;
  @IsString() al3Start: string;
  @IsString() lob: string;
  @IsString() dataType: string;
  @IsString() classType: string;
  @IsString() al3GroupLength: string;
  @IsString() al3GroupName: string;
  @IsString() referenceId: string;
  @IsBoolean() isChild: boolean;
  @IsNumber() answerIntegrationId?: number;
  @IsNumber() formIntegrationId?: number;
}
