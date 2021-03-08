import { IsObject } from 'class-validator';

export class HubspotDto {
  @IsObject() client;
  @IsObject() company;
}
