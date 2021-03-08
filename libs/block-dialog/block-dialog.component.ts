import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ViewChild,
} from '@angular/core';

import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { IntakeComponents } from './block-dialog.types';

@Component({
  selector: 'app-form-builder-component-block-dialog',
  templateUrl: './block-dialog.html',
  styleUrls: ['./block-dialog.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: false },
    },
  ],
})

export class BlockDialogComponent implements OnInit {
  @Input() selectedQuestion;
  @Input() questionIndex: any;
  @Input() sectionIndex: any;
  @Input() formType;
  @Output() tabItemClicked = new EventEmitter();
  @Output() addQuestionGroup = new EventEmitter();
  @Output() addQuestion = new EventEmitter();

  @ViewChild('dropdown') dropdown;

  activeTab = 1;
  tabs = new IntakeComponents().getIntakeComponents;

  ngOnInit(): void {
  }

  onAddQuestion(question: any) {
    this.activeTab = 2;
    this.addQuestion.emit(question);
  }

  onAddQuestionGroup(node: any) {
    this.activeTab = 1;
    this.addQuestionGroup.emit(node);
  }

  onTabItemClicked(item, tab) {
    this.tabItemClicked.emit({
      item, 
      tab, 
      questionIndex: this.questionIndex, 
      sectionIndex: this.sectionIndex
    });
    this.dropdown.toggle(true);
  }
}
