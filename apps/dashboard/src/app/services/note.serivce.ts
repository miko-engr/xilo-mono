import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Note } from "../models/note.model";
import { Client } from "../models/client.model";

@Injectable()
export class NoteService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'note';

  constructor(private http: HttpClient) {}

  //delete a Note
  delete(note: Note) {
    return this.http.delete(this.apiUrl + '/' + note.id);
  }

  // Get one Note
  get(note: Note) {
      const noteId = note ? '/' + note.id : '';
      return this.http.get(this.apiUrl + noteId);
  }

  // Get all Client Notes
  getByClient(client: Client) {
      const clientId = client ? '/client/' + client.id : '';
    return this.http.get(this.apiUrl + clientId);
  }

  // Update a Note
  patch(note: Note) {
      const noteId = note.id ? '/' + note.id : '';
      if(note.id) {
        return this.http.patch(this.apiUrl + noteId, note);
      }
  }

  // Create a new note
  post(note: Note) {
      return this.http.post(this.apiUrl, note);
  }
}
