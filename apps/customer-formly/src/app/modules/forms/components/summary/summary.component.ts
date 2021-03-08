import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Page, SummaryItem, Question, Answer, Client } from '../../models';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import {
  FormView,
  FormViewService,
  IndexSummary,
} from '@xilo-mono/form-contracts';
import { ActivatedRoute, Params } from '@angular/router';
import { CustomerFormFacade } from '@xilo-mono/form-viewer';
import { takeUntil } from 'rxjs/operators';

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
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ])
        )
      ),
      transition(':leave', animate('100ms ease-in')),
    ]),
  ],
})
export class SummaryComponent implements OnInit, OnDestroy {
  @Input() mainForm: FormGroup;
  @Input() page: Page;
  @Input() client: Client;
  @Input() formData: FormView;
  @Input() isMobile: boolean;
  @Input() summary: SummaryItem[];
  @Input() isLastQuestion: boolean;
  @Input() question: Question;
  @Input() currentForm: FormGroup;
  @Input() model: any = {};

  @Output() createNewFormQuestionTrigger: EventEmitter<
    string
  > = new EventEmitter();

  @Output() deleteMultipleItemTrigger: EventEmitter<
    SummaryItem
  > = new EventEmitter();

  public ngUnsubscriber: Subject<any> = new Subject<void>();
  currentExpanded;

  sectionIndex = 0;
  subsectionIndex: number;
  sectionProgress = 0;
  questionProgress = 0;
  subsectionProgress = 0;
  progressSummary: any;

  constructor(private customerFormFacade: CustomerFormFacade) {}

  ngOnInit(): void {
    this.customerFormFacade.sectionIndex$
      .pipe(takeUntil(this.ngUnsubscriber))
      .subscribe((index) => {
        this.sectionIndex = index;
      });
    this.customerFormFacade.progressSummary$
      .pipe(takeUntil(this.ngUnsubscriber))
      .subscribe((progress) => {
        this.progressSummary = progress;
        this.sectionProgress = progress.sectionIndex;
        this.questionProgress = progress.questionIndex;
        this.subsectionProgress = progress.subsectionIndex;
      });
    this.customerFormFacade.subsectionIndex$
      .pipe(takeUntil(this.ngUnsubscriber))
      .subscribe((index) => {
        this.subsectionIndex = index;
      });
  }

  ngOnChanges() {
    console.log('form data:');
    console.log(this.formData);
  }

  ngOnDestroy() {
    try {
      this.ngUnsubscriber.next();
      this.ngUnsubscriber.complete();
    } catch (e) {
      // console.warn('ngOnDestroy', e);
    }
  }

  summaryItemValid(summaryItem: any, subsection: number) {
    const formControl: AbstractControl = summaryItem.formControl;

    if (subsection >= 0) {
      const subControl = (<FormArray>formControl).controls[subsection];
      return subControl?.valid && !subControl?.pristine;
    } else {
      return formControl?.valid && !formControl?.pristine;
    }
  }

  showProgressIndicator(summaryItem: any, index: number, subsection: number) {
    if (this.hasRepeatAnswers(summaryItem)) {
      return (
        index === this.sectionProgress &&
        (index !== this.sectionIndex || subsection > this.subsectionIndex)
      );
    } else {
      return index !== this.sectionIndex && index === this.sectionProgress;
    }
  }

  getAnswer(summaryItem: any, question: any, answer: any, subsection = 0) {
    if (summaryItem?.formControl?.value) {
      const formValue = summaryItem.formControl.value[subsection];
      if (formValue) {
        const questionValue = formValue[question.key];
        if (questionValue) {
          return questionValue[answer.key];
        }
      }
    }
    return null;
  }

  handlePageChange(section: number, subsection: number = 0) {
    this.customerFormFacade.setSectionAndQuestion(section, 0, subsection);
  }

  resumeProgress() {
    this.customerFormFacade.setSectionAndQuestion(
      this.sectionProgress,
      this.questionProgress,
      this.subsectionProgress
    );
  }

  isShowMoreActivated(summaryItem: SummaryItem) {
    // return (
    //   this.currentExpanded === `${summaryItem.pageIndex}${summaryItem.subsection}`
    // );
    return false;
  }
  toggleShowMore(summaryItem?: SummaryItem) {
    this.currentExpanded = summaryItem
      ? `${summaryItem.pageIndex}${summaryItem.subIndex}`
      : null;
  }

  handleAddNewItemTrigger(objname: string) {
    this.createNewFormQuestionTrigger.emit(objname);
  }
  handleDeleteMultipleItemClick(summaryItem: SummaryItem) {
    if (confirm('Are you sure want to delete this?')) {
      this.deleteMultipleItemTrigger.emit(summaryItem);
    }
  }
  isCurrentPageInProgress(
    summaryItem: any,
    index: number,
    repeatIndex
  ): boolean {
    if (this.hasRepeatAnswers(summaryItem)) {
      return (
        index === this.sectionIndex && repeatIndex === this.subsectionIndex
      );
    } else {
      return index === this.sectionIndex;
    }
  }
  hasRepeatAnswers(summaryItem: any) {
    if (summaryItem?.formControl?.value) {
      return summaryItem?.formControl?.value?.length > 1;
    }
    return false;
  }

  getRepeatAnswers(summaryItem: any) {
    return summaryItem?.formControl?.value || [];
  }

  checkVisited(sectionIndex: number) {
    return sectionIndex <= this.sectionProgress;
  }
}
