import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  Page,
  Form,
  SummaryItem,
  Question,
  Answer,
  Client,
} from '../../models';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { IndexSummary } from '@xilo-mono/form-contracts';

@Component({
  selector: 'app-summary-item',
  templateUrl: './summary-item.component.html',
  styleUrls: ['./summary-item.component.scss'],
  animations: [
    trigger('ShowMoreAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(0px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(
        ':enter',
        animate(
          '300ms ease-out',
          keyframes([
            style({ opacity: 0, transform: 'translateY(0px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ])
        )
      ),
      transition(':leave', animate('100ms ease-in')),
    ]),
  ],
})
export class SummaryItemComponent implements OnInit, OnDestroy {
  @Input() summaryItem: any;
  @Input() valid = false;
  @Input() inProgress = false;
  @Input() subindex = 0;
  @Input() showProgressIndicator = false;
  @Input() hasRepeats = false;
  @Input() isLast = false;
  @Input() visited = false;
  @Output() pageChange = new EventEmitter();
  @Output() resumeProgress = new EventEmitter();
  @Output() removeItem = new EventEmitter();

  isShowMoreActivated = false;

  showAnswers = false;

  private ngUnsubscriber: Subject<any> = new Subject<void>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {}

  ngOnDestroy() {
    try {
      this.ngUnsubscriber.next();
      this.ngUnsubscriber.complete();
    } catch (e) {
      // console.warn('ngOnDestroy', e);
    }
  }

  getLabel() {
    if (this.hasRepeats) {
      return `${this.summaryItem?.templateOptions?.label} ${this.subindex + 1}`;
    } else {
      return this.summaryItem?.templateOptions?.label;
    }
  }

  getFormValue() {
    if (this.summaryItem?.formControl?.value) {
      if (this.hasRepeats) {
        return this.summaryItem.formControl.value[this.subindex];
      } else {
        return this.summaryItem.formControl.value;
      }
    }
  }

  getAnswer(question: any, answer: any) {
    if (this.summaryItem?.formControl?.value) {
      const formValue = this.getFormValue();
      if (formValue) {
        const questionValue = formValue[question.key];
        if (questionValue) {
          return questionValue[answer.key];
        }
      }
    }
    return null;
  }

  handlePageChange() {
    this.pageChange.emit();
  }

  resumeProgressClick() {
    this.resumeProgress.emit();
  }

  removeItemClick() {
    this.removeItem.emit();
  }
}
