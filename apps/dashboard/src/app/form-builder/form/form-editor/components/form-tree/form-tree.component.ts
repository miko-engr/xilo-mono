import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-form-builder-component-form-tree',
  templateUrl: './form-tree.component.html',
  styleUrls: ['./form-tree.component.scss']
})
export class FormTreeComponent implements OnInit, OnChanges {
  @Input() isSettingOpened = false;
  @Input() isConditionOpened = false;
  @Input() form;
  @Output() switchCondition = new EventEmitter();
  @Output() switchSetting = new EventEmitter();
  @Output() selectQuestion = new EventEmitter();
  @Output() selectSection = new EventEmitter();
  selectedNode: any;

  settingOpened = false;
  conditionOpened = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if(changes.isSettingOpened) {
      this.settingOpened = changes.isSettingOpened.currentValue;
    }
    if(changes.isConditionOpened) {
      this.conditionOpened = changes.isConditionOpened.currentValue;
    }
  }

  onSwitchSetting($event) {
    this.switchSetting.emit($event);
  }

  onSwitchCondition($event) {
    this.switchCondition.emit($event);
  }

  onSelectQuestion($event) {
    this.selectQuestion.emit($event);
  }

  onSelectSection($event) {
    this.selectSection.emit($event);
  }
}
