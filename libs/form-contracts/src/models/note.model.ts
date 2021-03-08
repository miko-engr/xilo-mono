export class Note {
  constructor(
    public id?: string,
    public text?: string,
    public clientNoteId?: number,
    public agentNoteId?: number,
    public companyNoteId?: number,
    public userNoteId?: number,
    public submissionNoteId?: number,
    public updatedAt?: Date,
    public createdAt?: Date,
  ){}
}
