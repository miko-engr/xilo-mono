import { Client } from "./client.model";
import { Agent } from "./agent.model";
import { Lifecycle } from "./lifecycle.model";
import { Company } from "./company.model";
import { User } from "./user.model";

export class Note {
  constructor(
    public id?: string,
    public text?: string,
    public clientNoteId?: number,
    public agentNoteId?: number,
    public companyNoteId?: number,
    public userNoteId?: number,
    public updatedAt?: Date,
    public createdAt?: Date,
    public client?: Client,
    public agent?: Agent,
    public company?: Company,
    public user?: User
  ){}
}
