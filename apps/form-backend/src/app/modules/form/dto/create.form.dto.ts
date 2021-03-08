import {
  IsNumber,
  IsString,
  IsBoolean,
  IsDate,
  IsArray,
} from 'class-validator';

export class CreateFormDto {
  @IsNumber() readonly id?: number;
  @IsString() type: string;
  @IsBoolean() isAuto: boolean;
  @IsBoolean() isHome: boolean;
  @IsDate() createdAt?: Date;
  @IsDate() updatedAt?: Date;
  @IsNumber() companyFormId: number;
  @IsString() title: string;
  @IsBoolean() isDynamic: boolean;
  @IsBoolean() isTemplate: boolean;
  @IsBoolean() hasDRates: boolean;
  @IsBoolean() hasVendorRates: boolean;
  @IsBoolean() resultsIsEnabled: boolean;
  @IsBoolean() discountsIsEnabled: boolean;
  @IsString() legal: string;
  @IsString() discountsProgressButtonText: string;
  @IsBoolean() isSimpleForm: boolean;
  @IsBoolean() isAutoHome: boolean;
  @IsString() externalLink: string;
  @IsBoolean() hasDynamicStartPage: boolean;
  @IsBoolean() hasFilterByState: boolean;
  @IsArray() states: string[];
  @IsBoolean() isCommercial: boolean;
  @IsArray() tags: string[];
  @IsBoolean() hasFormTags: boolean;
  @IsBoolean() hasDefaultAssignedAgent: boolean;
  @IsNumber() agentFormId: number;
  @IsBoolean() listClientDetailsEmail: boolean;
  @IsBoolean() styleEmail: boolean;
  @IsString() finishedFormEmailText: string;
  @IsBoolean() sendFinishedFormEmail: boolean;
  @IsString() logo: string;
  @IsString() icon: string;
  @IsBoolean() isEnabled: boolean;
  @IsBoolean() emailDefaultAgentOnly: boolean;
  @IsString() customerType: string;
  @IsString() customHtml: string;
  @IsBoolean() isFireOnComplete: boolean;
  @IsArray() integrations: string[];
  @IsNumber() pdfId: number;
  @IsNumber() infusionsoftTagId: number;
  @IsBoolean() hasRoundRobinAssignment: boolean;
  @IsArray() roundRobinAgents: number[];
  @IsBoolean() hasDownloadPdf: boolean;
  @IsString() companyPhone: string;
  @IsString() companyEmail: string;
  @IsString() companyName: string;
  @IsString() companyWebsite: string;
  @IsBoolean() hasNotificationPdfAttachment: boolean;
  @IsBoolean() isV2Form: boolean;
  @IsNumber() dynamicRaterFormId: number;
}
