import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'xilo-mono-tree-question',
  templateUrl: './tree-question.component.html',
  styleUrls: ['./tree-question.component.scss'],
})
export class TreeQuestionComponent implements OnInit {
  @Input() question: any;
  @Input() mode: string;
  @Input() isDragging: boolean;

  @Output() settingClick = new EventEmitter();
  @Output() conditionsClick = new EventEmitter();
  @Output() duplicateClick = new EventEmitter();
  @Output() deleteClick = new EventEmitter();
  @Output() newQuestionClick = new EventEmitter();

  showAddQuestion = false;

  constructor() {}

  ngOnInit(): void {}
}
