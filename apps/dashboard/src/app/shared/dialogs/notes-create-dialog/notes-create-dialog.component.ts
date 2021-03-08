import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { Agent } from '../../../models/agent.model';
import { Client } from '../../../models/client.model';
import { NoteService } from '../../../services/note.serivce';
import { Note } from '../../../models/note.model';
import { ClientService } from '../../../services/client.service';

@Component({
    selector: 'app-notes-create-dialog',
    templateUrl: './notes-create-dialog.component.html',
    styleUrls: ['./notes-create-dialog.component.css'],
  })
  export class NotesCreateDialogComponent implements OnInit {
    @ViewChild('editor', { static: true }) editorElement: ElementRef;
    client: Client;
    clients: Client[];
    origClients: Client[];
    agent: Agent;
    body = null;
    loading = false;
    dateFilter = null;
    clientsRetrieved = false;
    to = null;
    isEdit = false;
    note: Note = null;

    constructor(
        // private clientService: ClientService,
        private logService: LogService,
        private noteService: NoteService,
        public dialogRef: MatBottomSheetRef<NotesCreateDialogComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
    ) {}

    ngOnInit() {
      this.client = this.data.client;
      this.agent = this.data.agent;
      this.isEdit = this.data.isEdit;
      this.note = this.data.note;
      // this.getClients();
      this.editorElement.nativeElement.focus();
    }

    createNote() {
      if (this.body) {
        const newNote = new Note();
        newNote.clientNoteId = +this.client.id;
        newNote.text = this.body;
        newNote.companyNoteId = this.client.companyClientId;
        newNote.agentNoteId = this.agent ? this.agent.id : null;
        this.noteService.post(newNote)
        .subscribe(data => {
          this.logService.success('Note created successfully');
          this.dialogRef.dismiss({success: true});
        }, error => {
          this.logService.console(error, true);
        });
      } else {
        this.logService.warn('You must add text in the note');
      }
    }

    updateNote() {
        if (this.note.text) {
          this.note.clientNoteId = +this.client.id;
          this.note.companyNoteId = this.client.companyClientId;
          this.note.agentNoteId = this.agent ? this.agent.id : null;
          this.noteService.patch(this.note)
          .subscribe(data => {
            this.logService.success('Note updated successfully');
            this.dialogRef.dismiss({success: true});
          }, error => {
            this.logService.console(error, true);
          });
        } else {
          this.logService.warn('You must add text in the note');
        }
    }

    createCopy(orig) {
      return JSON.parse(JSON.stringify(orig));
    }

    // getClients(newDateFilter?: any) {
    //   const params = {};
    //   if (!this.agent.canSeeAllClients) {
    //     params['agentId'] = this.agent.id;
    //   }
    //   if (newDateFilter) {
    //     params['dateRange'] = newDateFilter;
    //   } else {
    //     params['dateRange'] = this.dateFilter;
    //   }
    //   this.clientService.getClientsBy(params)
    //       .subscribe(clients => {
    //           this.clients = clients['obj'];
    //           this.origClients = this.createCopy(this.clients);
    //           this.clientsRetrieved = true;
    //           this.loading = false;
    //       }, error => {
    //           this.loading = false;
    //           this.logService.console(error, false);
    //       });
    // }

    filter(name: string) {
      if (name === '' || !name) {
        this.clients = this.createCopy(this.origClients);
        return;
      }
      name = name.toLowerCase();
      this.clients = this.origClients.filter(client => {
        return this.nameExists(client, name);
      });
    }

    removeClient() {
      this.client = null;
    }

    nameExists(client: Client, value: string) {
      const name = this.returnName(client) ? this.returnName(client).toLowerCase() : null;
      value = value ? value.toLowerCase() : null;
      if (name && value) {
        return (name.includes(value));
      } else {
        return false;
      }
    }

    returnName(client: Client) {
      if (client.business && client.business.entityName) {
          return client.business.entityName;
      } else if (client.firstName && client.lastName) {
          return `${client.firstName} ${client.lastName}`;
      } else if (client.fullName) {
          return `${client.fullName}`;
      } else if (client.firstName) {
          return `${client.firstName} --`;
      } else if (client.lastName) {
          return `-- ${client.lastName}`;
      } else if (client.drivers && client.drivers[0]) {
          const driver = client.drivers[0];
          if (driver.applicantGivenName && driver.applicantSurname) {
              return `${driver.applicantGivenName} ${driver.applicantSurname}`;
          } else if (driver.fullName) {
              return `${driver.fullName}`;
          } else if (driver.applicantGivenName) {
              return `${driver.applicantGivenName} --`;
          } else if (driver.applicantSurname) {
              return `-- ${driver.applicantSurname}`;
          }
      } else {
        return null;
      }
    }

    assignClient(client: Client) {
      this.client = client;
      this.to = '';
    }

    styleMenu() {
      if (this.to && this.to !== '') {
        return { display: 'block' }
      }
    }

    closeDialog() {
      this.dialogRef.dismiss();
    }

  }
