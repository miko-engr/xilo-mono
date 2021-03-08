import { User } from "./user.model";

export class Document {
  constructor(
    public id?: string,
    public fileName?: string,
    public objName?: string,
    public type?: string,
    public contentType?: string,
    public createdAt?: Date,
    public user?: User
  ){}
}