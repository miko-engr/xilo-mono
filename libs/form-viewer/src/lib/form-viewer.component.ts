import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  DoCheck,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import {
  loadSubmission,
  createSubmission,
  updateSubmission,
} from './+state/submission/submission.actions';
import {
  getSubmissionLoaded,
  getSubmissionError,
  getSubmissionEntity,
  getSubmissionNote,
} from './+state/submission/submission.selectors';
import {
  Submission,
  FormViewService,
  NotificationService,
  FormView,
  SubmissionService,
  IndexSummary,
} from '@xilo-mono/form-contracts';
import { Params, ActivatedRoute } from '@angular/router';
import { ofType } from '@ngrx/effects';
import * as SubmissionActions from './+state/submission/submission.actions';
import { CustomerFormFacade } from './+state/customer-form/customer-form.facade';
import { takeUntil, map } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { v4 } from 'uuid';
import { datatableType } from './components/grid/datatable-formly.type';

@Component({
  selector: 'xilo-mono-form-viewer',
  templateUrl: './form-viewer.component.html',
})
export class FormViewerComponent implements OnInit, DoCheck, OnDestroy {
  @Input() fields: FormlyFieldConfig[];
  @Input() options: FormlyFormOptions;
  @Input() isValid: boolean;
  @Input() form: FormGroup;
  @Input() formView: FormView;
  @Input() model: any = {};
  @Input() preview = false;
  @Output() formChanged = new EventEmitter<any>();
  @Output() showAlert = new EventEmitter<{ type: string; message: string }>();
  @Output() isLoading = new EventEmitter<boolean>();
  @Output() formCompleted = new EventEmitter<any>();
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);

  submission$: Observable<any>;
  note$: Observable<any>;
  loading$: Observable<any>;
  error$: Observable<any>;
  submissionMetadata = {};
  customerFormMetadata = {};

  indexSummary: IndexSummary;

  public get isIntakeForm() {
    return (
      this.fields && this.fields[0] && this.fields[0].type === 'intake-form'
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler = () => {
    if (confirm('Are you sure you want to exit and submit this form as is?')) {
      this.onSubmit();
    }
  };

  private ngUnsubscribe$ = new Subject();

  constructor(
    private actionsSubject: ActionsSubject,
    private formViewService: FormViewService,
    private submissionService: SubmissionService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private store: Store<any>,
    private customerFormFacade: CustomerFormFacade
  ) {
    if (this.isIntakeForm) {
      this.store.dispatch(
        loadSubmission({ id: this.queryParams.submissionId })
      );
    }
    this.loading$ = this.store.pipe(select(getSubmissionLoaded));
    this.error$ = this.store.pipe(select(getSubmissionError));
    this.submission$ = this.store.pipe(select(getSubmissionEntity));
    this.note$ = this.store.pipe(select(getSubmissionNote));
  }

  addDatatableType(section) {
    const datatable = section.fieldGroup.filter((x) => x.type === 'datatable');

    if (datatable.length) return;

    const key = v4();

    const qgData = section.fieldGroup.filter((x) => {
      if (x.type === 'question-group') {
        x.hide = true;
        return x;
      }
    });

    if (qgData && qgData.length > 0) {
      const column = qgData[0].fieldGroup.map((x) => {
        return {
          name: x.templateOptions.label,
          prop: x.templateOptions.dataKey,
        };
      });

      const fieldGroup = qgData[0].fieldGroup.map((x) => {
        delete x.templateOptions.label;
        return {
          type: x.type,
          key: x.templateOptions.dataKey,
          templateOptions: x.templateOptions,
        };
      });

      const model = qgData.map((x) => {
        let ret: any[] = [];
        const item = x.fieldGroup.map((y) => {
          return {
            [`${y.templateOptions.dataKey}`]: '',
          };
        });

        ret.push(Object.assign({}, ...item));

        return ret[0];
      });

      section.fieldGroup.push(datatableType(key, column, fieldGroup, model));
    }
  }

  updateModelForDatatable = (formFields) => {
    let modelDatatable = {};
    formFields.forEach((field) => {
      if (field.type === 'intake-section') {
        field.fieldGroup.forEach((f) => {
          if (f.type === 'datatable') {
            modelDatatable[f.key] = f.templateOptions.model;
          }
        });
      } else if (field.type === 'intake-repeat') {
        if (field.fieldGroup) {
          field.fieldGroup.forEach((f) => {
            if (f.type === 'intake-section') {
              f.fieldGroup.forEach((fg) => {
                if (fg.type === 'datatable') {
                  modelDatatable[fg.key] = fg.templateOptions.model;
                }
              });
            }
          });
        }
      }
    });

    Object.keys(this.model).map((key) => {
      if (Array.isArray(this.model[key])) {
        if (modelDatatable[key]) {
          this.model[key] = modelDatatable[key];
        } else {
          this.model[key] = this.model[key].map((model) => {
            Object.keys(model).map((k) => {
              model[k] = modelDatatable[k] ? modelDatatable[k] : model[k];
            });
            return model;
          });
        }
      } else {
        Object.keys(this.model[key]).map((k) => {
          if (modelDatatable[k]) {
            this.model[key][k] = modelDatatable[k];
          }
        });
      }
    });

    this.model = { ...this.model };
  };

  updateModelForGrid = (formFields) => {
    let modelGrid = {};
    formFields.forEach((field) => {
      if (field.type === 'intake-section') {
        field.fieldGroup.forEach((f) => {
          if (f.type === 'grid') {
            modelGrid[f.key] = f.templateOptions.model;
          }
        });
      } else if (field.type === 'intake-repeat') {
        if (field.fieldGroup) {
          field.fieldGroup.forEach((f) => {
            if (f.type === 'intake-section') {
              f.fieldGroup.forEach((fg) => {
                if (fg.type === 'grid') {
                  modelGrid[fg.key] = fg.templateOptions.model;
                }
              });
            }
          });
        }
      }
    });

    Object.keys(this.model).map((key) => {
      if (Array.isArray(this.model[key])) {
        if (modelGrid[key]) {
          this.model[key] = modelGrid[key];
        } else {
          this.model[key] = this.model[key].map((model) => {
            Object.keys(model).map((k) => {
              model[k] = modelGrid[k] ? modelGrid[k] : model[k];
            });
            return model;
          });
        }
      } else {
        Object.keys(this.model[key]).map((k) => {
          if (modelGrid[k]) {
            this.model[key][k] = modelGrid[k];
          }
        });
      }
    });

    this.model = { ...this.model };
  };

  ngOnInit() {
    this.submission$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((retSubmission) => {
        this.model = this.makeCopy(retSubmission) || {};
      });

    this.submissionService.updateMetadata
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((updateObj) => {
        if (this.isIntakeForm) {
          if (updateObj.key) {
            this.submissionService.metadata[updateObj.key] = updateObj.value;
          }
        } else {
          if (this.indexSummary?.subsectionIndex === 0) {
            if (updateObj.key) {
              this.submissionService.metadata[updateObj.key] = updateObj.value;
            }
          }
        }
      });

    this.note$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((retNote) => {
      this.formViewService.setNote(this.makeCopy(retNote || {}));
      this.formViewService.changeNoteState(true);
    });
    this.formViewService.submitForm
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((submit) => {
        if (submit) {
          this.onSubmit();
        }
      });
    this.actionsSubject
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        ofType(SubmissionActions.createSubmissionSuccess),
        map((res) => res['res'])
      )
      .subscribe((res) => {
        const params = {
          clientId: res.metadata.clientId,
          formId: this.queryParams.formId,
          version: this.formView.metadata['version'],
          agentId:
            this.formView.metadata['agentId'] ||
            this.queryParams.agentId ||
            null,
        };
        this.notificationService.sendNotification(params).subscribe(
          (notifRes) => {},
          (error) => console.log(error)
        );
        this.formCompleted.emit();
      });
    this.formViewService.rebuildForm
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((rebuild) => {
        if (rebuild) {
          this.rebuildForm();
        }
      });

    this.customerFormFacade.formStatus$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((status) => {
        if (status === 'Finished') {
          this.formCompleted.emit();
        }
      });

    this.customerFormFacade.indexSummary$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((summary) => {
        this.indexSummary = summary;
      });

    this.customerFormFacade.metadata$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((metadata) => {
        this.customerFormMetadata = metadata;
      });

    if (this.preview) {
      this.customerFormFacade.setPreviewMode(true);
    }
    this.formViewService.model = this.model;
    this.formViewService.form = this.form;
    if (
      this.fields &&
      this.fields[0] &&
      this.fields[0].type === 'customer-form'
    ) {
      this.setHideExpressions(this.fields, true);
    }
  }

  ngDoCheck() {
    if (
      this.fields &&
      this.fields[0] &&
      this.fields[0].type === 'intake-form'
    ) {
      this.setHideExpressions(this.fields, false);
      this.formViewService.changeFormState({ valid: this.form.valid });

      // this.updateModelForDatatable(this.fields[0].fieldGroup);
      this.updateModelForGrid(this.fields[0].fieldGroup);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  rebuildForm() {
    try {
      (<any>this.options)._buildForm(true);
    } catch (error) {
      console.log(error);
    }
  }

  onNext($event) {
    this.formChanged.emit($event);
  }

  makeCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  onAlert(type: string, message: string) {
    this.showAlert.emit({ type, message });
  }

  onSubmit() {
    this.queryParams = Object.assign({}, this.route.snapshot.queryParams);
    if (!this.queryParams.submissionId) {
      this.onAlert('success', 'Form submitted');
      const newSubmission = new Submission(
        null,
        {
          ...this.queryParams,
          ...this.submissionService.metadata,
          version: this.formView.metadata['version'],
        },
        cloneDeep(this.model),
        this.formViewService.getNote()
      );
      this.store.dispatch(
        createSubmission({
          submission: newSubmission,
          params: this.queryParams,
        })
      );
      if (this.isIntakeForm) {
        setTimeout(() => {
          this.form.reset();
          this.formViewService.setNote({ text: null });
        }, 500);
      }
    } else {
      let metadata = {};
      if (this.isIntakeForm) {
        metadata = {
          ...this.queryParams,
          ...this.submissionService.metadata,
        };
      } else {
        metadata = {
          ...this.queryParams,
          ...this.submissionService.metadata,
          ...this.customerFormMetadata,
        };
      }
      const submissionObj = new Submission(
        this.queryParams.submissionId,
        metadata,
        [cloneDeep(this.model)],
        this.formViewService.getNote()
      );
      this.store.dispatch(updateSubmission({ submission: submissionObj }));
      if (this.isIntakeForm) {
        setTimeout(() => {
          this.onAlert('success', 'Form submitted');
          const params = {
            clientId: null,
            formId: this.formView.metadata['key'],
            version: this.formView.metadata['version'],
            agentId:
              this.formView.metadata['agentId'] ||
              this.queryParams.agentId ||
              null,
            attachPDF: this.formView.metadata['attachPDF'],
          };
          // TODO: add 'attachPDF : true' into 'params' here to send PDF with email
          this.notificationService.sendNotification(params).subscribe(
            (res) => {},
            (error) => console.log(error)
          );
          this.form.reset();
        }, 2000);
      } else {
        this.customerFormFacade.updateFormStatus('Finished');
      }
    }
  }

  setHideExpressions(fields: FormlyFieldConfig[], formType: boolean) {
    if (fields && fields.length > 0) {
      fields.forEach((field) => {
        if (field?.templateOptions?.query) {
          field.hideExpression = (model, formState, field) =>
            this.hideExpression(this.model, this.indexSummary, field, formType);
        }
        if (formType) {
          if (field.fieldArray) {
            this.setHideExpressions(field.fieldArray.fieldGroup, formType);
          } else {
            this.setHideExpressions(field.fieldGroup, formType);
          }
        } else {
          if (field.fieldGroup) {
            this.setHideExpressions(field.fieldGroup, formType);
          } else {
            if (field?.fieldArray?.fieldGroup) {
              this.setHideExpressions(field.fieldArray.fieldGroup, formType);
            }
          }
        }
      });
    }
  }

  hideExpression(
    model: any,
    formState: any,
    field: FormlyFieldConfig,
    formType: boolean
  ) {
    const query = field?.templateOptions?.query;
    if (query) {
      if (model) {
        const rules: any[] = query.rules;
        if (rules && rules.length > 0) {
          const rulesMatched = rules.map((rule) => {
            const value = this.getValue(
              rule.field,
              rule.parents,
              formState,
              formType
            );
            return this.evaluateRule(rule, value);
          });
          const queryMatched =
            query.operator === 'and'
              ? rulesMatched.reduce((a, b) => a && b, true)
              : rulesMatched.reduce((a, b) => a || b, false);
          if (query.showWhenTrue) {
            return !queryMatched; // hide if rules are not satisfied
          } else {
            return queryMatched;
          }
        }
      }
      return false;
    } else {
      field.templateOptions.hidden = false;
      return false;
    }
  }

  getValue(key: string, parents: string[], formState: any, formType: boolean) {
    const parentsCopy = [...parents];
    if (this.model) {
      let valueObj = { ...this.model };
      try {
        if (parentsCopy?.length > 0) {
          while (parentsCopy.length > 0) {
            const id = parentsCopy.shift();
            if (formType) {
              if (Array.isArray(valueObj)) {
                valueObj = valueObj[formState.subsectionIndex][id];
              } else {
                valueObj = valueObj[id];
              }
            } else {
              if (Array.isArray(valueObj[id])) {
                valueObj = valueObj[id][0];
              } else {
                valueObj = valueObj[id];
              }
            }
          }
        }
        return valueObj[key];
      } catch (error) {
        return null;
      }
    }
  }

  evaluateRule(rule, value: any) {
    if (rule.value === 'true') {
      rule.value = true;
    } else if (rule.value === 'false') {
      rule.value = false;
    }

    switch (rule.operator) {
      case '=':
        return rule.value === value;
      case 'contains':
        return value.indexOf(rule.value) > -1;
      case '!=':
        return rule.value !== value;
      case 'in':
        return rule.value.includes(value);
      case 'not in':
        return !rule.value.includes(value);
      case 'is null':
        return value === null || value === undefined;
      case 'is not null':
        return value !== null && value !== undefined;
      case '<':
        return parseFloat(value) < rule.value;
      case '<=':
        return parseFloat(value) <= rule.value;
      case '>':
        return parseFloat(value) > rule.value;
      case '>=':
        return parseFloat(value) >= rule.value;
      default:
        return false;
    }
  }
}
