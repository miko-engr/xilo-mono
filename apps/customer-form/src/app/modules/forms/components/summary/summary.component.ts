import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Page, Form, SummaryItem, Question, Answer, Client } from '../../models';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
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
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
          ])
        )
      ),
      transition(':leave', animate('100ms ease-in'))
    ])
  ]
})
export class SummaryComponent implements OnInit, OnDestroy {
  @Input() mainForm: FormGroup;
  @Input() page: Page;
  @Input() client: Client;
  @Input() formData: Form;
  @Input() isMobile: boolean;
  @Input() summary: SummaryItem[];
  @Input() isLastQuestion: boolean;
  @Input() subindex: number;
  @Input() question: Question;
  @Input() currentForm: FormGroup;
  @Input() currentIndexOfMultipleItemInProgress: number;
  @Output() changePage: EventEmitter<{
    page: string | number;
    subIndex: number;
  }> = new EventEmitter();
  @Output() changeQuestion: EventEmitter<any> = new EventEmitter();
  @Output() gotoQuestion: EventEmitter<{
    pageIndex: number;
    subIndex: number;
    questionIndex: number;
  }> = new EventEmitter();
  @Output() createNewFormQuestionTrigger: EventEmitter<
    string
  > = new EventEmitter();

  @Output() deleteMultipleItemTrigger: EventEmitter<
    SummaryItem
  > = new EventEmitter();

  @Output() triggerSearchByAddress = new EventEmitter<{
    answer: Answer;
    addressObj: any;
  }>();

  public ngUnsubscriber: Subject<any> = new Subject<void>();
  currentExpanded;

  ngOnInit(): void {}

  handleAnswerClick(pageIndex, subIndex, questionIndex) {
    this.changePage.emit(pageIndex);
    setTimeout(() => {
      this.gotoQuestion.emit({ pageIndex, subIndex, questionIndex });
    }, 100);
  }

  handlePageChange(pageNumber, subIndex) {
    this.changePage.emit({ page: pageNumber, subIndex });
  }
  handleQuestionChange(event) {
    this.changeQuestion.emit(event);
  }
  isShowMoreActivated(summaryItem: SummaryItem) {
    return (
      this.currentExpanded === `${summaryItem.pageIndex}${summaryItem.subIndex}`
    );
  }
  toggleShowMore(summaryItem?: SummaryItem) {
    this.currentExpanded = summaryItem
      ? `${summaryItem.pageIndex}${summaryItem.subIndex}`
      : null;
  }
  ngOnDestroy() {
    try {
      this.ngUnsubscriber.next();
      this.ngUnsubscriber.complete();
    } catch (e) {
      // console.warn('ngOnDestroy', e);
    }
  }
  handleAddNewItemTrigger(objname: string) {
    this.createNewFormQuestionTrigger.emit(objname);
  }
  handleDeleteMultipleItemClick(summaryItem: SummaryItem) {
    if (confirm('Are you sure want to delete this?')) {
      this.deleteMultipleItemTrigger.emit(summaryItem);
    }
  }
  isCurrentPageInProgress(summaryItem: SummaryItem): boolean {
    if (this.page.id === summaryItem.pageid) {
      if (summaryItem.isCreatedAtRunTime) {
        return (
          this.currentIndexOfMultipleItemInProgress === summaryItem.subIndex
        );
      }
      return true;
    }
    return false;
  }
  handleAddressAutocompleted(selectedData: {
    addressObj: any;
    answer: Answer;
  }) {
    this.triggerSearchByAddress.emit(selectedData);
  }
}
