import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormService } from '../../../services/form.service';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';
import { LoaderModalService } from '../../../services/loader-modal.service';
import { AlertControllerService } from '../../../services/alert.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['../company-info/company-info.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {
  @Output() onUpdated = new EventEmitter<any>();
  checkedIds = []
  externalFormList = [
    {
      icon: '/assets/signup-flow/import-form/gravity.svg',
      heading: 'Gravity Forms',
      desc: 'Advanced from for your worlPress-Powered website',
    },
    {
      icon: '/assets/signup-flow/import-form/jotForm.svg',
      heading: 'Jot Forms',
      desc: 'Form Builder where from which you can collect data via email',
    },
    {
      icon: '/assets/signup-flow/import-form/wufoo.svg',
      heading: 'Wufoo Forms',
      desc: 'Form Builder where from which you can collect data via email',
    },
    {
      icon: '/assets/signup-flow/import-form/cognito.svg',
      heading: 'Cognito Form',
      desc: 'Form Builder where from which you can collect data via email',
    },
  ];
  currentFormInfo: any;
  importNewForm: FormGroup;
  forms = [];
  company = new Company(null);
  selectedFormList = [];
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private formService: FormService,
    private companyService: CompanyService,
    private loaderModalService:LoaderModalService,
    private alertService:AlertControllerService
  ) { }

  ngOnInit(): void {
    this.importNewForm = this.fb.group({
      url: ['', Validators.required],
    });
    this.getSelectedFormList();
  }

  ngOnDestroy(): void {
  }

  getCompany() {
    this.companyService.get().subscribe(company => {
      this.company = company['obj'];
    });
  }

  getSelectedFormList() {
    this.formService.getPreSelectedForms()
      .subscribe(formList => {
        this.selectedFormList = formList;
      }, error => {
        console.log(error);
      });
  }

  async getFormList() {
    const forms = await this.formService.getDefaultForms();
    this.forms = await forms.filter(async (oneForm) => {
      const isSelectedForm = await this.selectedFormList.filter(form => form.title === oneForm.title);
      isSelectedForm.length ? oneForm.checked = true : oneForm.checked = false;
      isSelectedForm.length ? oneForm.isExisting = true : oneForm.isExisting = false;
      return oneForm;
    });
  };

  importForm(template) {
    const dialog = this.dialog.open(template, { panelClass: 'callAPIDialog' });
    dialog.afterClosed().subscribe(result => {
    });
  }

  inportConfForm(item, template) {
    this.currentFormInfo = item;
    const dialog = this.dialog.open(template, { panelClass: 'callAPIDialog' });
    dialog.beforeClosed().subscribe(result => {
      if (this.importNewForm.valid) {
        this.forms.push({ title: this.currentFormInfo.heading, isSelected: true, isImported: true });
      }
    })
    dialog.afterClosed().subscribe(result => {
      this.currentFormInfo = '';
    });
  }

  selectForm(i, form,  element) {
    this.selectedFormList[i].checked = !this.selectedFormList[i].checked
    if (this.selectedFormList[i].checked) {
      this.checkedIds.push(form.id)
      element.classList.add('checked');
    } else {
      let index = this.checkedIds.findIndex((e) => e === form.id)
      this.checkedIds.splice(index, 1)
      element.classList.remove('checked')
    }
    return false;
  }

  createdSelectedForms(currentStep) {
    if (!this.checkedIds) {
      return this.onUpdated.emit(currentStep)
    }
    this.loaderModalService.openModalLoader('');
      this.formService.createSelectedForm({ forms: this.checkedIds })
        .subscribe(() => {
          this.loaderModalService.closeModal();
          this.onUpdated.emit(currentStep)
        }, (error) => {
          this.loaderModalService.closeModal();
          if(error?.error?.errorType !== 6) this.alertService.error(error.error.error.message)
      });
    }
}

