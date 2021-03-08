import { Company } from "./company.model";

export class User {
  constructor(
    public id?: number,
    public username?: string,
    public name?: string,
    public firstName?: string,
    public lastName?: string,
    public password?: string,
    public isAdmin?: boolean,
    public brandColor?: string,
    public website?: string,
    public companyName?: string,
    public resetPasswordLink?: string,
    public updatedAt?: Date,
    public createdAt?: Date,
    public companyUserId?: number,
    public company?: Company,
    public isActive?: boolean
  ) {}
}
