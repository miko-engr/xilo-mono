import { Company } from "./company.model";

export class PlatformManager {
  constructor(
    public id?: number,
    public email?: string,
    public name?: string,
    public password?: string,
    public resetPasswordLink?: string,
    public googleAdwordsCustomerId?:string,
    public googleApiAccessToken?:string,
    public googleApiRefreshToken?:string,
    public updatedAt?: Date,
    public createdAt?: Date,
    public companies?: Company[]
  ) {}
}
