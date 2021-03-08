import { Page, Question, Answer, Client } from './../../models';
import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import {VehicleListService, ApplicationStateService, AnalyticsService} from '../../services';
import { conditionsAreTrue } from '../page/page-helper-functions';
import { Observable } from 'rxjs';
import { findOccupations } from '../../../../../app/common/industry.util';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
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
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
          ])
        )
      ),
      transition(':leave', animate('100ms ease-out'))
    ]),

    trigger('QuestionAnimation', [
      state('unloaded', style({ opacity: 0, transform: 'translateY(120px)' })),
      state('appear', style({ opacity: 1, transform: 'translateY(0px)' })),
      state('moveup', style({ opacity: 0, transform: 'translateY(-200px)' })),
      state('movedown', style({ opacity: 0, transform: 'translateY(200px)' })),
      transition('unloaded => appear', animate('400ms ease-in')),
      transition(
        'appear => moveup',
        animate(
          '100ms ease-in-out',
          keyframes([
            style({ opacity: 1, transform: 'translateY(0px)', offset: 0 }),
            style({ opacity: 0, transform: 'translateY(-200px)', offset: 1 })
          ])
        )
      ),
      transition(
        'moveup => appear',
        animate(
          '100ms ease-in-out',
          keyframes([
            style({ opacity: 0, transform: 'translateY(200px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0px)', offset: 1 })
          ])
        )
      ),
      transition(
        'appear => movedown',
        animate(
          '100ms ease-in-out',
          keyframes([
            style({ opacity: 1, transform: 'translateY(0px)', offset: 0 }),
            style({ opacity: 0, transform: 'translateY(200px)', offset: 1 })
          ])
        )
      ),
      transition(
        'movedown => appear',
        animate(
          '100ms ease-in-out',
          keyframes([
            style({ opacity: 0, transform: 'translateY(-200px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0px)', offset: 1 })
          ])
        )
      )
    ])
  ]
})
export class DynamicFormComponent implements OnInit {
  @Input() set question(value: Question) {
    if (value) {
      this.currentQuestion = value;
      this.answers = value.answers;
    }
  }

  constructor(
    private vehicleListService: VehicleListService,
    private cd: ChangeDetectorRef,
    private applicationService: ApplicationStateService,
    private analyticsService: AnalyticsService
  ) {}
  @Input() page: Page;
  @Input() isLastQuestion: Boolean;
  @Input() isMobile: boolean;
  @Input() mainForm: FormGroup;
  @Input() currentForm: FormGroup;
  @Input() subindex: number;
  @Input() summary: any;
  @Input() client: Client;
  @Input() company;
  @Input() form;
  @Input() questionAnimationState: 'unloaded' | 'moveup' | 'appear';

  @Output() changeQuestion: EventEmitter<string> = new EventEmitter();
  @Output() changePage: EventEmitter<{
    page: number | string;
    subIndex?: number;
  }> = new EventEmitter();
  @Output() createNewFormQuestionTrigger: EventEmitter<
    string
  > = new EventEmitter();
  @Output() triggerSearchByAddress = new EventEmitter<{
    answer: Answer;
    addressObj: any;
  }>();

  @ViewChild('FormSection') formSection: ElementRef;

  answers: Answer[];
  errorDetailsFromPage$: Observable<{
    message: string;
    type: 'warning' | 'error';
  }>;
  currentQuestion: Question;

  ngOnInit() {
    this.errorDetailsFromPage$ = this.applicationService.formErrorsSource;
  }
  handleNextClick() {
    // this.currentForm.value
    this.changeQuestion.emit('next');
    if (this.formSection) {
      setTimeout(() => {
        this.formSection.nativeElement.scrollIntoView();
      }, 350);
    }
  }

  isDisabled() {
    return !this.currentForm.valid;
  }

  isInvalid(answerId): boolean {
    return (
      this.currentForm.get(answerId).touched &&
      this.currentForm.get(answerId).invalid
    );
    // &&
    // !this.currentForm.get(answerId).pristine
  }

  setAnswerOptions(answerId, options) {
    const index = this.answers.findIndex(
      answer => answer.id.toString() === answerId
    );
    this.answers[index].options = options;

    this.answers[index] = { ...this.answers[index] };
    this.cd.markForCheck();
  }

  setErrormessage(message) {
    this.applicationService.formErrorsSource.next({ message, type: 'warning' });
    this.cd.markForCheck();

    setTimeout(() => {
      this.applicationService.formErrorsSource.next(null);
      this.cd.markForCheck();
    }, 3500);
  }
  // when vehile data needs to be loaded with api dynamically
  // selected value is coming after the details from vin is available
  // body style is added after the model is found
  handleGetVehicleData(data: {
    type: string;
    value: string;
    isVinDetails: boolean;
    bodyStyle?: string;
  }) {
    const idsMap: any = this.findIdsOfVehiclePropertyKeysFromCurrentQuestion();
    if (data.type === 'year') {
      if (data.isVinDetails) {
        this.currentForm.patchValue({ [idsMap.vehicleModelYear]: data.value });
        this.currentForm.get(idsMap.vehicleModelYear).markAsDirty();
      } else {
        this.currentForm.get(idsMap.vehicleManufacturer).reset();
        this.setAnswerOptions(idsMap.vehicleManufacturer, []);
        this.currentForm.get(idsMap.vehicleModel).reset();
        this.setAnswerOptions(idsMap.vehicleModel, []);
        this.currentForm.get(idsMap.vehicleBodyStyle).reset();
        this.setAnswerOptions(idsMap.vehicleBodyStyle, []);
      }
      if(data.value) this.vehicleListService.getEZMakes(data.value).subscribe(makes => {
        this.setAnswerOptions(idsMap.vehicleManufacturer, makes);
      });
    }
    if (data.type === 'make') {
      if (data.isVinDetails) {
        this.currentForm.patchValue({
          [idsMap.vehicleManufacturer]: data.value
        });
        this.currentForm.get(idsMap.vehicleManufacturer).markAsDirty();
      } else {
        this.currentForm.get(idsMap.vehicleModel).reset();
        this.setAnswerOptions(idsMap.vehicleModel, []);
        this.currentForm.get(idsMap.vehicleBodyStyle).reset();
        this.setAnswerOptions(idsMap.vehicleBodyStyle, []);
      }
      const year = this.currentForm.get(idsMap.vehicleModelYear).value;
      if(year && data.value) this.vehicleListService
        .getEZModels(year, data.value)
        .subscribe(models => {
          this.setAnswerOptions(idsMap.vehicleModel, models);
        });
    }
    if (data.type === 'model') {
      if (data.isVinDetails) {
        this.currentForm.patchValue({ [idsMap.vehicleModel]: data.value });
        this.currentForm.get(idsMap.vehicleModel).markAsDirty();
      } else {
        this.currentForm.get(idsMap.vehicleBodyStyle).reset();
        this.setAnswerOptions(idsMap.vehicleBodyStyle, []);
      }
      const year = this.currentForm.get(idsMap.vehicleModelYear).value;
      const model = this.currentForm.get(idsMap.vehicleManufacturer).value;
      if(year && model && data.value) this.vehicleListService
        .getEZSubModels(year, model, data.value)
        .subscribe(subModels => {
          const subModel = subModels[0];
          const bodyStyles = subModels.map(bodyStyle =>
            bodyStyle.split('|')[0].trim()
          );
          this.setAnswerOptions(idsMap.vehicleBodyStyle, bodyStyles);
          if (data.bodyStyle) {
            this.currentForm.patchValue({
              [idsMap.vehicleBodyStyle]: data.bodyStyle
            });
            this.currentForm.get(idsMap.vehicleBodyStyle).markAsDirty();
          }
          const suggestedVin = subModel ? subModel.split('|')[1].trim() : null;
          if (
              suggestedVin &&
              !(this.currentForm.get(idsMap.vehicleVin) &&
                  this.hasVin(this.currentForm.get(idsMap.vehicleVin).value))
          ) {
            this.currentForm.patchValue({
              [idsMap.vehicleVin]: suggestedVin
            });
            this.currentForm.get(idsMap.vehicleVin).markAsDirty();
          }
        });
    }
  }

  hasVin(formValue: string) {
    return formValue && formValue.length && formValue.length === 17;
  }

  getVehicleDetailsByVIN(details: { vehicleVin: string; clicked: boolean }) {
    // Get vehicle info including year, make and model from api
    const vin = details.vehicleVin;
    this.applicationService.formErrorsSource.next(null);
    if (vin.length < 17) this.resetVehicleSelect();
    if (!vin.length) return
    if (vin.length === 17) {
      this.vehicleListService
        .getEZVehicleByVin(details.vehicleVin)
        .subscribe(data => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');

          // check for API response error
          if (
            xmlDoc.getElementsByTagName('Result')[0].innerHTML === 'VINNotFound'
          ) {
            this.setErrormessage(
              'There was an issue with this VIN. Please enter vehicle manually'
            );
            this.resetVehicleSelect();
          } else {
            let vinYear;
            let vinMake;
            let vinModel;
            let vinBodyStyle;
            if (xmlDoc.getElementsByTagName('Year')[0]) {
              vinYear = Number(
                xmlDoc.getElementsByTagName('Year')[0].innerHTML
              );
            }
            if (xmlDoc.getElementsByTagName('Make')[0]) {
              vinMake = xmlDoc.getElementsByTagName('Make')[0].innerHTML;
            }
            if (xmlDoc.getElementsByTagName('Model')[0]) {
              vinModel = xmlDoc.getElementsByTagName('Model')[0].innerHTML;
            }
            if (
              xmlDoc.getElementsByTagName('BodyStyle')[0] &&
              xmlDoc.getElementsByTagName('Drive') &&
              xmlDoc.getElementsByTagName('EngineInfo')
            ) {
              vinBodyStyle = `${
                xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML
              } ${xmlDoc.getElementsByTagName('Drive')[0].innerHTML} ${
                xmlDoc.getElementsByTagName('EngineInfo')[0].innerHTML
              }`;
            } else if (
              xmlDoc.getElementsByTagName('BodyStyle')[0] &&
              xmlDoc.getElementsByTagName('Drive')
            ) {
              vinBodyStyle = `${
                xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML
              } ${xmlDoc.getElementsByTagName('Drive')[0].innerHTML}`;
            } else if (
              xmlDoc.getElementsByTagName('BodyStyle')[0] &&
              xmlDoc.getElementsByTagName('EngineInfo')[0].innerHTML
            ) {
              vinBodyStyle = `${
                xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML
              } ${xmlDoc.getElementsByTagName('EngineInfo')[0].innerHTML}`;
            } else if (xmlDoc.getElementsByTagName('BodyStyle')[0]) {
              vinBodyStyle = `${
                xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML
              }`;
            }
            this.handleGetVehicleData({
              type: 'year',
              value: vinYear.toString().trim(),
              isVinDetails: true
            });
            this.handleGetVehicleData({
              type: 'make',
              value: vinMake.trim(),
              isVinDetails: true
            });
            this.handleGetVehicleData({
              type: 'model',
              value: vinModel.trim(),
              isVinDetails: true,
              bodyStyle: vinBodyStyle.trim()
            });
          }
        });
    } else {
      this.applicationService.formErrorsSource.next({
        message: 'Vehicle VIN should be 17 letter ID',
        type: 'warning'
      });
    }
  }

  resetVehicleSelect() {
    const idsMap: any = this.findIdsOfVehiclePropertyKeysFromCurrentQuestion();
    const year = this.currentForm.get(idsMap.vehicleModelYear).value;
    const make = this.currentForm.get(idsMap.vehicleManufacturer).value;
    const model = this.currentForm.get(idsMap.vehicleModel).value;
    if(!year && !make && !model) return
    if(year) this.handleGetVehicleData({ type: 'year', value: '', isVinDetails: true });
    if(make) this.handleGetVehicleData({ type: 'make', value: '', isVinDetails: true });
    if(model) this.handleGetVehicleData({ type: 'model', value: '', isVinDetails: true, bodyStyle: '' });
    this.currentForm.get(idsMap.vehicleModelYear).reset();
    this.currentForm.get(idsMap.vehicleManufacturer).reset();
    this.setAnswerOptions(idsMap.vehicleManufacturer, []);
    this.currentForm.get(idsMap.vehicleModel).reset();
    this.setAnswerOptions(idsMap.vehicleModel, []);
    this.currentForm.get(idsMap.vehicleBodyStyle).reset();
    this.setAnswerOptions(idsMap.vehicleBodyStyle, []);
  }

  isNextButtonNeeded() {
    let isNeeded = false;
    if (
      this.isMobile &&
      this.currentQuestion &&
      this.currentQuestion.answers.length === 1 &&
      this.currentQuestion.answers[0].isMultipleSelect
    ) {
      isNeeded = true;
    }
    return (
      (this.isMobile &&
        this.currentQuestion &&
        !!this.currentQuestion.nextButtonText) ||
      isNeeded
    );
  }

  // check if it is a type of mutiple type answer
  isMultipleAdd(answer: Answer) {
    return (
      answer.isAddDriver ||
      answer.isAddHome ||
      answer.isAddIncident ||
      answer.isAddLocation ||
      answer.isAddRecreationalVehicle ||
      answer.isAddVehicle ||
      answer.isAddPolicy ||
      answer.propertyKey === 'addMultiple'
    );
  }

  handleAddNewItemTrigger(objname: string) {
    this.createNewFormQuestionTrigger.emit(objname);
  }

  answerIsEnabled(answer: Answer) {
    if (
      answer.answerConditions &&
      answer.answerConditions.length &&
      answer.answerConditions.length > 0
    ) {
      if (
        conditionsAreTrue(answer.answerConditions, this.mainForm, this.subindex)
      ) {
        return true;
      } else {
        // if this answer is disabled then clear the value of this control
        this.currentForm.get(answer.answerId).reset();
        return false;
      }
    } else {
      return true;
    }
  }
  findIdsOfVehiclePropertyKeysFromCurrentQuestion(): { [x: string]: any } {
    const idsMap = {};
    this.currentQuestion.answers.forEach(answer => {
      idsMap[answer.propertyKey] = answer.id.toString();
    });
    return idsMap;
  }

  handleAddressAutocompleted(selectedData: {
    addressObj: any;
    answer: Answer;
  }) {
    this.applicationService.addressAutocompleteSource.next(selectedData);
  }

  handleGetOccupationsFromIndustry(industry) {
    const occupationAnswer = this.answers.find(answer => answer.isOccupation);
    this.currentForm.get(occupationAnswer.answerId).reset();

    const filteredOccupations = findOccupations(industry);
    this.setAnswerOptions(occupationAnswer.answerId, filteredOccupations);
  }
}
