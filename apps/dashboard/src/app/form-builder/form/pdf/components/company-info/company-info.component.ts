import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LogService } from '../../../../../services/log.service';
import { FormService } from '../../../../../services/form.service';
import { Form } from '../../../../../models/form.model';
import { FormBuilderService } from '@xilo-mono/form-contracts';
import { PdfService } from '../../../../../services/pdf.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { ToastService } from '../../../../../services/toast.service'

@Component({
  selector: 'app-form-builder-component-pdf-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.scss'],
})
export class PdfCompanyInfoComponent implements OnInit {
  enable = true;

  @Input() pdf: any;
  pdfSrc;
  pdfFields;
  @Output() updateFormField = new EventEmitter<any>();
  inputs: number[];
  formFields = [];
  forms: Form[] = [];
  keysRetrieved = false;
  formFieldsRetrieved = false;
  contextMenu;
  pdfChangeSubscription: Subscription;
  isRenamingPdfTitle = false
  originalPdfTitle = ''
  
  constructor(
    private logService: LogService,
    private formService: FormService,
    private formBuilderService: FormBuilderService,
    private pdfService: PdfService,
    private toastService: ToastService,
  ) {
    this.inputs = Array.from(Array(23), (x, i) => i);
  }

  ngOnInit(): void {
    this.getFormFields();
    this.pdfChangeSubscription = this.formBuilderService.pdfChanged
    .subscribe(change => {
      if (change) {
        this.getFormFields();
      }
    })
  }

  getFormFields() {
    this.pdfService.getFormField(this.pdf).subscribe(
      (formField) => {
        console.log(formField);
        this.pdfFields = formField['pdf'];
        this.formFields = formField['obj'];
        this.pdfSrc = formField['fileUrl'];
        console.log(this.pdfFields, this.formFields, this.pdfSrc);
        this.formFieldsRetrieved = true;
        this.getForms();
        this.formBuilderService.changeFormFields({ formFields: this.formFields });
      }, (error) => {
        this.logService.console(error, true);
      });
  }

  getForms() {
    this.formService.getByCompany(true).subscribe(
      (forms) => {
        this.forms = forms['obj'];
      },
      (error) => {
        this.logService.console(error, true);
      }
    );
  }

  loadComplete(event: any) {}

  onUpdateFormField(event: any) {
    const { index, field } = event
    this.formFields[index] = field
    this.formBuilderService.changeFormFields({ formFields: this.formFields, pdfId: this.pdf.id });
  }

  onTitleDoubleClick(event:MouseEvent) {
    this.stopClickPropagation(event)
    this.isRenamingPdfTitle = true
    this.originalPdfTitle   = this.pdf.formName
  }

  stopClickPropagation(event:MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  renamePdfTitle(event) {
    this.stopClickPropagation(event)
    const { id, formName } = this.pdf
    this.pdfService.renamePdfTitle(id, formName).subscribe(response => {
      this.toastService.showSuccess(response.message)
      this.isRenamingPdfTitle = false
    }, (error) => {
      this.logService.console(error, true)
    })
  }

  cancelPdfTitleRenaming(event) {
    this.stopClickPropagation(event)
    this.isRenamingPdfTitle = false
    this.pdf.formName = this.originalPdfTitle
  }
}
