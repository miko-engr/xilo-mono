import { Component, OnInit, Input } from '@angular/core';
import { Company, NoteService, Note, FormViewService } from '@xilo-mono/form-contracts';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'xilo-mono-intake-form-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class IntakeFormNotesComponent implements OnInit {
  @Input() agentId: number;
  @Input() companyDetails: Company;
  note = new FormControl('', Validators.required);
  noteObj: Note = {};

  constructor(
    private formViewService: FormViewService,
    private noteService: NoteService
  ) {}
  ngOnInit() {
    this.note.valueChanges
    .subscribe(value => {
      this.noteObj.text = value;
      this.formViewService.setNote(value);
    });
    this.formViewService.noteLoaded
    .subscribe(hasLoaded => {
      const loadedNote: Note = this.formViewService.getNote();
      if (loadedNote) {
        this.noteObj = loadedNote;
        this.note.setValue(loadedNote.text);
      }
    })
  }
}
