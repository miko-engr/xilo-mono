import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import {
  FormViewService,
  QuestionGroupAnimationState,
} from '@xilo-mono/form-contracts';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerFormFacade } from '../../../+state/customer-form/customer-form.facade';
@Component({
  selector: 'xilo-mono-form-viewer-customer-section-wrapper-panel',
  templateUrl: './section-wrapper.component.html',
  styleUrls: ['./section-wrapper.component.scss'],
  animations: [
    trigger('ErrorAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(0px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(
        ':enter',
        animate(
          '300ms ease-in',
          keyframes([
            style({ opacity: 0, transform: 'translateY(0px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ])
        )
      ),
      transition(':leave', animate('100ms ease-out')),
    ]),

    trigger('QuestionAnimation', [
      state('unloaded', style({ opacity: 0, transform: 'translateY(200px)' })),
      state('appear', style({ opacity: 1, transform: 'translateY(0px)' })),
      state('moveup', style({ opacity: 0, transform: 'translateY(-200px)' })),
      state('movedown', style({ opacity: 0, transform: 'translateY(200px)' })),
      transition('unloaded => appear', animate('200ms ease-in')),
      transition('appear => unloaded', animate('200ms ease-in')),
      transition(
        'appear => moveup',
        animate(
          '200ms ease-in',
          keyframes([
            style({ opacity: 1, transform: 'translateY(0px)', offset: 0 }),
            style({ opacity: 0, transform: 'translateY(-200px)', offset: 1 }),
          ])
        )
      ),
      transition(
        'moveup => appear',
        animate(
          '200ms ease-in',
          keyframes([
            style({ opacity: 0, transform: 'translateY(200px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0px)', offset: 1 }),
          ])
        )
      ),
      transition(
        'appear => movedown',
        animate(
          '200ms ease-in',
          keyframes([
            style({ opacity: 1, transform: 'translateY(0px)', offset: 0 }),
            style({ opacity: 0, transform: 'translateY(200px)', offset: 1 }),
          ])
        )
      ),
      transition(
        'movedown => appear',
        animate(
          '200ms ease-in',
          keyframes([
            style({ opacity: 0, transform: 'translateY(-200px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0px)', offset: 1 }),
          ])
        )
      ),
    ]),
  ],
})
export class FormViewerCustomerSectionPanelWrapperComponent extends FieldWrapper
  implements OnInit {
  @ViewChild('header') header: ElementRef;

  questionIndex = 0;
  sectionIndex = 0;
  subsectionIndex = 0;
  fieldIndex = 0;
  questionAnimationState: QuestionGroupAnimationState = 'unloaded';
  isClosed = false;
  questionHovered: any = { flag: false, questionToBeDisplayed: '' };
  animationInProgress$ = new BehaviorSubject<boolean>(true);

  showErrors = false;

  public get visibleQuestions() {
    return this.field?.fieldGroup?.filter(
      (field) => !field?.templateOptions?.hidden
    );
  }

  public get questionCount() {
    return this.visibleQuestions?.length || 0;
  }

  public get previousEnabled() {
    return (
      this.questionIndex > 0 ||
      this.sectionIndex > 0 ||
      this.subsectionIndex > 0
    );
  }

  public get nextEnabled() {
    return this.sectionValid();
  }

  private startedAnimation = false;

  private ngUnsubscriber$ = new Subject();

  constructor(
    private customerFormFacade: CustomerFormFacade,
    private formViewService: FormViewService
  ) {
    super();
  }

  ngOnInit() {
    this.customerFormFacade.indexSummary$
      .pipe(takeUntil(this.ngUnsubscriber$))
      .subscribe(({ sectionIndex, subsectionIndex, questionIndex }) => {
        this.sectionIndex = sectionIndex;
        this.subsectionIndex = subsectionIndex;
        this.questionIndex = questionIndex;
      });

    combineLatest([
      this.customerFormFacade.questionAnimation$,
      this.customerFormFacade.animationInProgress$,
    ])
      .pipe(takeUntil(this.ngUnsubscriber$))
      .subscribe(([animation, inProgress]) => {
        if (!inProgress) {
          this.questionAnimationState = animation;
        }
      });

    this.fieldIndex = this.formViewService.getFieldIndex(this.field);
  }

  ngOnDestroy() {
    this.ngUnsubscriber$.next();
    this.ngUnsubscriber$.complete();
  }

  isHidden() {}

  progressBarHover(key: string, i) {
    if (i < this.field.fieldGroup.length) {
      if (this.canNavigate(i) && this.questionIndex !== i) {
        this.questionHovered = {
          flag: true,
          questionToBeDisplayed: this.field.fieldGroup[i].templateOptions.label,
        };
      }
    }
  }

  progressBarHoverOut() {
    this.questionHovered = {
      flag: false,
      questionToBeDisplayed: '',
    };
  }

  ishighlightedProgressItem(index: number, key: string) {
    if (this.showErrors) {
      return (
        (index < this.questionIndex && this.isValid(key)) ||
        index === this.questionIndex
      );
    } else {
      return index <= this.questionIndex;
    }
  }
  isAttended(questionIndex, key: string) {
    return questionIndex > this.questionIndex && this.isValid(key);
  }
  isError(questionIndex: number, key: string) {
    return (
      this.showErrors &&
      questionIndex < this.questionIndex &&
      !this.isValid(key)
    );
  }

  isValid(key: string): boolean {
    const question = this.formControl?.get(key);
    return question?.valid;
  }

  previousQuestion() {
    this.customerFormFacade.previous();
  }

  nextQuestion() {
    this.customerFormFacade.next();
  }

  progressBarClick(index: number) {
    if (index >= 0 && index < this.questionCount && this.canNavigate(index)) {
      this.customerFormFacade.goToQuestion(index);
    }
  }

  canNavigate(index: number) {
    if (index < 0 || index >= this.questionCount) {
      return false;
    } else if (index === 0) {
      return true;
    } else {
      const precedingQuestions = this.field.fieldGroup.slice(0, index);
      const precedingQuestionsValid = precedingQuestions
        .map((question) => question.formControl.valid)
        .reduce((a, b) => a && b, true);
      return precedingQuestionsValid;
    }
  }

  sectionValid() {
    return this.field?.fieldGroup[this.questionIndex]?.formControl?.valid;
  }

  animationStart() {
    if (this.fieldIndex === this.sectionIndex) {
      this.startedAnimation = true;
      this.customerFormFacade.animationStart();
    }
  }

  animationDone() {
    if (this.startedAnimation) {
      this.startedAnimation = false;
      this.customerFormFacade.animationDone();
    }
  }
}
