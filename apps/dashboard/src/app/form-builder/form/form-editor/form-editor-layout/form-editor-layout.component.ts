import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { FormGroup } from '@angular/forms';
import { LogService } from '../../../../services/log.service';
import { FormViewService, FormBuilderService } from '@xilo-mono/form-contracts';
import { ToastService } from '../../../../services/toast.service';
import { map } from 'rxjs/internal/operators/map';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../models/company.model';
import { BehaviorSubject } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-xilo-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor-layout.component.scss'],
})
export class FormEditorLayout implements OnInit {
  isSettingVisible = false;
  isConditionVisible = false;
  selectedField: any;
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  form$: Observable<any>;
  config: any = {};
  query: any = {};
  formModel = {};
  formOptions = {
    formState: {
      questionnum: 0,
      sectionnum: 0,
      subindex: 0,
    },
  };
  formGroup = new FormGroup({});
  form;
  intakeFields: FormlyFieldConfig[] = [{ type: 'intake-form', fieldGroup: [] }];
  customerFields: FormlyFieldConfig[] = [
    { type: 'customer-form', fieldGroup: [] },
  ];
  previewFields$ = new BehaviorSubject<FormlyFieldConfig[]>([]);
  previewFields: FormlyFieldConfig[] = [];
  currentSection = 0;
  currentQuestion = 0;
  formType = null;
  company$: Observable<Company>;
  loadingPreview = true;

  constructor(
    private companyService: CompanyService,
    private formBuilderService: FormBuilderService,
    private formViewService: FormViewService,
    private logService: LogService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.getForm();
    this.company$ = this.companyService.get().pipe(map((res) => res['obj']));
    this.formBuilderService.onSearchQuestion('');
  }

  getForm() {
    this.formViewService.getForm(this.queryParams.id).subscribe(
      (form) => {
        this.form = form;
        if (this.form.components[0].type === 'intake-form') {
          this.formType = 'intake-form';
          this.loadingPreview = false;
        } else {
          this.formType = 'customer-form';
        }
        this.formBuilderService.setForm(this.form);
        this.formBuilderService.changeFormState(true);
        this.onSelectSection(0);
      },
      (error) => {
        this.logService.console(error);
      }
    );
  }

  onSwitchSetting(settingObj: {
    question: any;
    section: any;
    questionGroup: any;
  }) {
    if (settingObj.question) {
      this.selectedField = settingObj.question;
    } else if (settingObj.questionGroup) {
      this.selectedField = settingObj.questionGroup;
    } else {
      this.selectedField = settingObj.section.fieldArray
        ? settingObj.section.fieldArray
        : settingObj.section;
      this.formViewService.changeRebuildForm(true);
    }
    this.isSettingVisible = true;
    this.isConditionVisible = false;
  }

  onSwitchCondition($event) {
    this.selectedField = null;
    this.isSettingVisible = false;
    setTimeout(() => {
      this.selectedField = $event;
      this.isConditionVisible = true;
    }, 200);
  }

  setPreviewFields() {
    // Customer forms need to be reinitialized on section change for the preview to work properly,
    // but intake forms are the opposite, for some reason
    if (this.formType === 'customer-form') {
      this.loadingPreview = true;
    }
    const section: FormlyFieldConfig = this.form.components[0].fieldGroup[
      this.currentSection
    ];
    if (this.formType === 'intake-form') {
      this.intakeFields[0].fieldGroup = [this.makeCopy(section)];
      this.previewFields$.next(this.makeCopy(this.intakeFields));
      // this.formViewService.changeRebuildForm(true);
    } else {
      let fields = section.fieldArray
        ? section.fieldArray.fieldGroup[this.currentQuestion]
        : section.fieldGroup[this.currentQuestion];
      this.customerFields[0].fieldGroup = [this.makeCopy(fields)];
      this.previewFields$.next([...this.customerFields]);
    }
    if (this.formType === 'customer-form') {
      setTimeout(() => {
        this.loadingPreview = false;
      }, 300);
    }
  }

  onSelectQuestion(question: number) {
    if (this.form.components[0].type === 'intake-form') {
      // this.intakeFields[0].fieldGroup = $event.children;
    } else {
      if (question >= 0) {
        this.currentQuestion = question;
      }
      this.setPreviewFields();
    }
    // this.onConditionClose();
    // this.onSettingClose();
  }

  onSelectSection(index: any) {
    if (index >= 0) {
      if (this.currentSection !== index) {
        this.currentQuestion = 0;
      }
      this.currentSection = index;
      console.log(this.formType, this.form.components[0].type);
      this.setPreviewFields();

      // setTimeout(() => {
      //   this.formViewService.changeRebuildForm(true);
      // }, 1000);
    }
  }

  onRefreshPreview() {
    if (this.form.components[0].type === 'intake-form') {
      this.intakeFields[0].fieldGroup[0] = this.makeCopy(
        this.form.components[0].fieldGroup[this.currentSection]
      );
    } else {
      this.customerFields[0].fieldGroup[0] = this.makeCopy(
        this.form.components[0].fieldGroup[this.currentSection]
      );
    }
    this.formViewService.changeRebuildForm(true);
    this.toastService.showMessage('Preview refreshed');
  }

  makeCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  switchSection(direction: number) {
    const newIndex = direction + this.currentSection;
    this.onSelectSection(newIndex);
  }

  onConditionClose() {
    this.isConditionVisible = false;
    this.selectedField = null;
  }

  onSettingClose() {
    this.isSettingVisible = false;
  }

  onConditionsClose() {
    this.isConditionVisible = false;
  }
}
